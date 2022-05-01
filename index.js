require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

//connect routes file
app.use('/', require('./routes/routes'))
app.use('/', express.static(path.join(__dirname, 'public')))

//mongoDB connection setup
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('connect with db'))
    .catch(error => console.log(error.message))


app.listen(process.env.PORT, () => {
    console.log(`application running on port ${process.env.PORT}`)
})