const express = require('express')
const router = express.Router()

router.use('/auth', require('./Authentication.routes'))
    .use('/assessment', require('./Assessment.routes'))

module.exports = router