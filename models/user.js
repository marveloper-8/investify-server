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
    phone:{
        type: Number,
        required: true
    },
    bankAccountName:{
        type: String
    },
    bankNumber:{
        type: Number
    },
    bankName:{
        type: String
    },
    nokName:{
        type: String
    },
    nokRelationship:{
        type: String
    },
    nokEmail:{
        type: String
    },
    nokPhone:{
        type: String
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
