const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    appMode:{
        type: String,
        default: "light"
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    emailToken:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    bankAccountName:{
        type: String,
        default: "e.g James Doe"
    },
    bankNumber:{
        type: String,
        default: "e.g 001XXXXXXX"
    },
    bankName:{
        type: String,
        default: "e.g Investify Africa Bank"
    },
    nokName:{
        type: String,
        default: "e.g Jane Doe"
    },
    nokRelationship:{
        type: String,
        default: "e.g Mother"
    },
    nokEmail:{
        type: String,
        default: "e.g jane@email.com"
    },
    nokPhone:{
        type: String,
        default: "e.g 0809-XXX-XXXX"
    },
    originalPassword:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    referredBy:{
        type: String
    },
    netWorth:{
        type: String
    },
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User", userSchema)
