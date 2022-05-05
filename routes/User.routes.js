const usersController = require('../controllers/Users.controller')
const authorizeUser = require('../middleware/Authorization.middleware')

const userRoute = require('express').Router()

userRoute.get('/list', usersController.allUserList)
    .put('/update/:id', authorizeUser, usersController.updateUserDetails)


module.exports = userRoute