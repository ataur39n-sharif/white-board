const AuthController = require('../controllers/Authentication.controller')

const authRoute = require('express').Router()

authRoute.post('/register', AuthController.register)
    .post('/login', AuthController.login)

module.exports = authRoute