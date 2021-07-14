const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireAdminLogin = require('../middleware/requireAdminLogin')
const requireLogin = require('../middleware/requireLogin')
const Collection = mongoose.model("Collection")

// collections
router.post('/create-collection', (req, res) => {
    const {
        label,
        value,
        type
    } = req.body
    if(!label){
        return res.status(422).json({error: "Please add name"})
    }
    
    const collection = new Collection({
        label,
        value,
        type,
        postedBy: req.admin
    })
    collection.save().then(result => {
        return res.json({collection: result})
    })
    .catch(err => {
        return res.json({err})
        console.log(err)
    })
})

router.get('/call-put-table', (req, res) => {
    Collection.find()
        .then(collections => {
            res.json({collections})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/collection/details/:id', (req, res) => {
    Collection.findOne({_id: req.params.id})
    .then(collection => {
        Collection.find({postId: req.params.id})
        .populate("postedBy", "_id collectionName")
        .exec((err, collections) => {
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({collection, collections})
        })
    }).catch(err => {
        return res.status(404).json({error: "Collection not found"})
    })
})

router.delete('/collection/delete/:id', (req, res) => {
    Collection.findOne({_id: req.params.id})
    .exec((err, collection) => {
        if(err || !collection){
            return res.status(422).json({error: err})
        }else{
            collection.remove()
            .then(result => {
                res.json({message: "successfully deleted"})
            }).catch(err => {
                console.log(err)
            })
        }
    })
})
// end of collections

module.exports = router
