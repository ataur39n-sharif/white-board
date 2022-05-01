const AuthController = require('../controllers/Authentication.controller')
const authorizeUser = require('../middleware/Authorization.midlleware')

const authRoute = require('express').Router()

authRoute
    .post('/register', AuthController.register)
    .post('/login', AuthController.login)
    .delete('/delete', authorizeUser, AuthController.removeUser)

module.exports = authRoute