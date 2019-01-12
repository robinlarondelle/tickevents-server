const routes = require('express').Router();
const authController = require("../controllers/authentication.controller")

routes.post('/login', authController.login)

module.exports = routes