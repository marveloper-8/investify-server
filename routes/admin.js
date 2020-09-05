const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Admin = mongoose.model("Admin")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireAdminLogin = require('../middleware/requireAdminLogin')

router.post('/signup-admin', (req, res) => {
    const {
        name,
        email,
        password
    } = req.body
    if(!name || !email || !password){
        return res.status(422).json({error: "Please add all the fields"})
    }
    Admin.findOne({email: email})
        .then((savedAdmin) => {
            if(savedAdmin){
                return res.status(422).json({error: "Admin already exists with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const admin = new Admin({
                        name,
                        email,
                        password: hashedPassword,

                    })
                    admin.save()
                        .then(admin => {
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

router.post('/signin-admin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    Admin.findOne({email:email})
        .then(savedAdmin => {
            if(!savedAdmin){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedAdmin.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedAdmin._id}, JWT_SECRET)
                        const {
                            _id, 
                            name,
                            email
                        } = savedAdmin
                        return res.json({token, admin:{
                            _id, 
                            name,
                            email
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

module.exports = router