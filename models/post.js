const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: true
    },
    pic: {
        type: String
    },
    propertyLocation: {
        type: String,
        required: true
    },
    insurancePartner: {
        type: String
    },
    numberOfUnits: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default:0
    },
    startDate: {
        type: Date
    },
    maturityDate: {
        type: Date
    },
    expectedReturns: {
        type: Number,
        default:0
    },
    timeExpectedReturns: {
        type: Number,
        default:0
    },
    payoutType: {
        type: String
    },
    unitType: {
        type: String
    },
    investmentType: {
        type: String
    },
    aboutProperty: {
        type: String
    },
    postedBy: {
        type: ObjectId,
        ref: "Admin"
    }
}, {timestamps: true})

mongoose.model("Post", postSchema)
