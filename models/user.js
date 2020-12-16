const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
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
        default: "e.g John Doe"
    },
    bankNumber:{
        type: String,
        default: "e.g 010012231"
    },
    bankName:{
        type: String,
        default: "e.g Zenith Bank"
    },
    referredBy:{
        type: String,
        required: false
    },
    netWorth:{
        type: String,
        required: false
    },
    generatedPassword:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User", userSchema)
