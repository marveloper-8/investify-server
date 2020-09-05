const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    numberOfUnits: {
        type: Number,
        requred: true
    },
    propertyLocation: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    maturityDate: {
        type: Date,
        required: true
    },
    investmentType: {
        type: String,
        required: true
    },
    unitType: {
        type: String,
        required: true
    },
    expectedReturns: {
        type: String,
        required: true
    },
    insurancePartner: {
        type: String,
        required: true
    },
    aboutProperty: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    comments: [{
        text:String,
        postedBy:{
            type: ObjectId,
            ref: "User"
        }
    }],
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: true})

mongoose.model("Post", postSchema)
