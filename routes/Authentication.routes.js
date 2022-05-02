const AuthController = require('../controllers/Authentication.controller')
const authorizeUser = require('../middleware/Authorization.middleware')

const authRoute = require('express').Router()

authRoute
    .post('/register', AuthController.register)
    .post('/login', AuthController.login)
    .delete('/remove-user', authorizeUser, AuthController.removeUser)

module.exports = authRoute