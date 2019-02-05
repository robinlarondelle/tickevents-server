const routes = require('express').Router();
const authController = require("../controllers/auth.controller")

routes.get('/login', authController.login1)
// routes.post('/register', authController.register)

module.exports = routes