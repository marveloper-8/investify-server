const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const collectionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: true})

mongoose.model("Collection", collectionSchema)
