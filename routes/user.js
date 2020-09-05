const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/user-details/:id', (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user => {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id firstName")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({user, posts})
        })
    }).catch(err => {
        return res.status(404).json({error: "User not found"})
    })
})

router.get('/user', (req, res) => {
    User.find()
    .populate("postedBy", "_id firstName")
    .then(user => {
        res.json({user})
    }).catch(err => {
        return res.status(404).json({error: "User not found"})
        // console.log(err)
    })
})

router.post("/update-bank", requireLogin, (req,res) => {   
    User.findByIdAndUpdate(req.user._id, { bankName:  req.body.bankName, bankNumber:  req.body.bankNumber, bankAccountName:  req.body.bankAccountName },   
    function(err) {  
    if (err) {  
        res.send(err);  
        return;  
    }  
        res.send({data:"Record has been Updated..!!"});  
    });  
})  

module.exports = router