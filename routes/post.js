const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
// const Transaction = mongoose.model("Transaction")

// posts
router.post('/create-post', requireAdminLogin, (req, res) => {
    const {
        propertyName, 
        price,
        numberOfUnits,
        propertyLocation,
        startDate,
        maturityDate,
        investmentType,
        unitType,
        expectedReturns,
        insurancePartner,
        aboutProperty,
        pic
    } = req.body
    if(!propertyName || !price || !numberOfUnits || !propertyLocation || !startDate || !maturityDate || !investmentType || !unitType || !expectedReturns || !insurancePartner || !aboutProperty || !pic){
        return res.status(422).json({error: "Please add all the fields"})
    }

    req.admin.password = undefined
    
    const post = new Post({
        propertyName, 
        price,
        numberOfUnits,
        propertyLocation,
        startDate,
        maturityDate,
        investmentType,
        unitType,
        expectedReturns,
        insurancePartner,
        aboutProperty,
        photo: pic,
        postedBy: req.admin
    })
    post.save().then(result => {
        return res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/all-post', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id firstName")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => {
            console.log(err)
        })
})

// router.get('/properties-details/:id', (req, res) => {
//     Post.findOne({_id: req.params.id})
//     .then(post => {
//         Post.find({postId: req.params.id})
//         .populate("postedBy", "_id propertyName")
//         .exec((err, posts) => {
//             if(err){
//                 return res.status(422).json({error: err})
//             }
//             res.json({post, posts})
//         })
//     }).catch(err => {
//         return res.status(404).json({error: "Property not found"})
//     })
// })

router.get('/properties-details/:id', (req, res) => {
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

router.delete('/delete-post/:postId', requireAdminLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if(err || !post){
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() === req.admin._id.toString()){
            post.remove()
            .then(result => {
                res.json({message: "successfully deleted"})
            }).catch(err => {
                console.log(err)
            })
        }
    })
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id email")
    .populate("postedBy","_id email")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
// end of posts










router.get('/my-dashboard', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
        .populate("postedBy", "_id name")
        .then(myPost => {
            return res.json({myPost})
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, {
        new: true
    })
    // .populate("likes", "-id firstName")
    .exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
})

router.put('/comments',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(422).json({error: err})
        } else{
            res.json(result)
        }
    })
})











// transactions
// router.post('/create-transaction', requireLogin, (req, res) => {
//     const {
//         photo,
//         propertyName, 
//         propertyLocation,
//         price,
//         unitsToTransact,
//         transactionStatus,
//         propertyLink
//     } = req.body
//     if(!pic || !propertyName || !propertyLocation || !price || !unitsToTransact || !transactionStatus || !propertyLink){
//         return res.status(422).json({error: "Please add all the fields"})
//     }

//     req.user.password = undefined
    
//     const transaction = new Transaction({
//         photo,
//         propertyName, 
//         propertyLocation,
//         price,
//         unitsToTransact,
//         transactionStatus,
//         propertyLink,
//         postedBy: req.user
//     })
//     transaction.save().then(result => {
//         return res.json({transaction: result})
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })

// router.get('/all-transaction', (req, res) => {
//     Transaction.find()
//         .populate("postedBy", "_id name")
//         .populate("comments.postedBy", "_id firstName")
//         .then(transactions => {
//             res.json({transactions})
//         })
//         .catch(err => {
//             console.log(err)
//         })
// })

// router.delete('/delete-transaction/:postId', requireAdminLogin, (req, res) => {
//     Transaction.findOne({_id: req.params.postId})
//     .populate("postedBy", "_id")
//     .exec((err, transaction) => {
//         if(err || !transaction){
//             return res.status(422).json({error: err})
//         }
//         if(transaction.postedBy._id.toString() === req.admin._id.toString()){
//             transaction.remove()
//             .then(result => {
//                 res.json({message: "successfully deleted"})
//             }).catch(err => {
//                 console.log(err)
//             })
//         }
//     })
// })
// end of transactions

module.exports = router
