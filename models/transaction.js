const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    propertyName: {
        type: String,
        required: true
    },
    propertyLocation: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    unitsToTransact: {
        type: String,
        required: true
    },
    transactionStatus: {
        type: String,
        required: true
    },
    propertyLink: {
        type: String,
        required: true
    },
    userLink: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    bankNumber: {
        type: String,
        required: true
    },
    bankAccountName: {
        type: String,
        required: true
    }
}, {timestamps: true})

mongoose.model("Transaction", postSchema)
