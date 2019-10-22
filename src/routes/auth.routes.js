const routes = require('express').Router();
const authController = require("../controllers/auth.controller")

routes.post('/login', authController.login)
routes.post('/register', authController.register)
routes.post('/tokens/resend-verification-email', authController.sendToken)
routes.post('/tokens/forgot-password', authController.sendToken)
routes.post('/verify-email', authController.verifyEmail)
routes.post('/set-new-password', authController.setNewPassword)
module.exports = routes