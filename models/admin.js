const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    appMode:{
        type: String,
        default: "light"
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

mongoose.model("Admin", adminSchema)