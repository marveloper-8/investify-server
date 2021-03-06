const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const collectionSchema = new mongoose.Schema({
    collectionName: {
        type: String,
        required: true
    },
    collectionType: {
        type: String
    },
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: true})

mongoose.model("Collection", collectionSchema)
