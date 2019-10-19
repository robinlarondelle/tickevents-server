const routes = require('express').Router();
const authController = require("../controllers/auth.controller")

routes.get('/pubkey', authController.getPublicKey)
routes.post('/login', authController.loginUser)
routes.post('/register', authController.registerUser)
routes.post('/verify-email', authController.verifyEmail)
routes.post('/resend-verification-email', authController.verifyEmail)
module.exports = routes