const routes = require('express').Router();
const authController = require("../controllers/auth.controller")

routes.post('/login', authController.loginUser)
routes.post('/register', authController.registerUser)
routes.post('/verify-email', authController.verifyEmail)

module.exports = routes