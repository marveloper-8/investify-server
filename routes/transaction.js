const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const Transaction = mongoose.model("Transaction")

// create transactions
router.post('/create-transaction', (req, res) => {
    const {
        photo,
        propertyName, 
        propertyLocation,
        price,
        unitsToTransact,
        transactionStatus,
        propertyLink,
        userLink,
        fullName,
        bankName,
        bankNumber,
        bankAccountName
    } = req.body
    if(!photo || !propertyName || !propertyLocation || !price || !unitsToTransact || !transactionStatus || !propertyLink || !userLink || !fullName || !bankName || !bankNumber || !bankAccountName){
        return res.status(422).json({error: "Please add all the fields"})
    }

//     req.user.password = undefined
    
    const transaction = new Transaction({
        photo,
        propertyName, 
        propertyLocation,
        price,
        unitsToTransact,
        transactionStatus,
        propertyLink,
        userLink,
        fullName,
        bankName,
        bankNumber,
        bankAccountName
    })
    transaction.save().then(result => {
        return res.json({transaction: result})
    })
    .catch(err => {
        console.log(err)
    })
})
// end of create transactions

// list of transactions
router.get('/all-transactions', (req, res) => {
    Transaction.find()
        .populate("postedBy", "_id fullName")
        .then(transactions => {
            res.json({transactions})
        })
        .catch(err => {
            console.log(err)
        })
})
// end of list of transactions

router.get('/transactions-details/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then(post => {
        Post.find({postId: req.params.id})
        .populate("postedBy", "_id propertyName")
        .exec((err, posts) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({post, posts})
        })
    }).catch(err => {
        return res.status(404).json({error: "Property not found"})
    })
})

module.exports = router
