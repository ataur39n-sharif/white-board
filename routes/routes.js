const express = require('express')
const router = express.Router()

router.use('/auth', require('./Authentication.routes'))
    .use('/assessment', require('./Assessment.routes'))
    .use('/user',require('../routes/User.routes'))

module.exports = router