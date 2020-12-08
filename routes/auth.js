const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')

router.put('/:id', requireLogin, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

router.post('/signup', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        bankAccountName,
        bankNumber,
        bankName,
        referredBy,
        netWorth,
        pic,
        password
    } = req.body
    if(!firstName || !lastName || !email || !phone || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    User.findOne({email: email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({error: "User already exists with that emailing"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        firstName,
                        lastName,
                        email,
                        phone,
                        bankAccountName,
                        bankNumber,
                        bankName,
                        referredBy,
                        netWorth,
                        pic,
                        password: hashedPassword,

                    })
                    user.save()
                        .then(user => {
                            res.json({message: "Saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    User.findOne({email:email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                        const {
                            _id, 
                            firstName, 
                            lastName, 
                            email,
                            phone,
                            bankNumber,
                            bankAccountName,
                            bankName,
                            netWorth,
                            referredBy,
                            pic
                        } = savedUser
                        return res.json({token, user:{
                            _id, 
                            firstName, 
                            lastName, 
                            email,
                            phone, 
                            bankNumber,
                            bankAccountName,
                            bankName,
                            netWorth,
                            referredBy,
                            pic
                        }})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})


router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})


router.put('/update-bank', (req,res)=>{
    let id = req.body.user_id
    // User.findById(req.user._id,{$set:{bankName:req.user.bankName}}
    User.findById(id, (err,result)=>{
         result.save()
            .then(doc => {
                res.status(201).json({
                    message: "Uploaded Successfully"
                })
            })
            .catch(err => {
                res.json(err)
            })
        //  res.json(result)
    })
})


router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((savedUser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router
