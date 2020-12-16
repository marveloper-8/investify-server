const express = require('express')
const mongoose = require('mongoose')
const app = express()
var cors = require('cors')
const PORT = process.env.PORT || 999
const {MONGOURI} = require('./config/keys')

mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log("Connected to mongo")
})
mongoose.connection.on('error', () => {
    console.log("Error connecting", err)
})


require('./models/user')
require('./models/admin')
require('./models/post')
require('./models/transaction')

app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/admin'))
app.use(require('./routes/post'))
app.use(require('./routes/transaction'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () => {
    console.log("server is running on ", PORT)
})
