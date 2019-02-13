const routes = require('express').Router()
const userController = require("../controllers/user.controller")

routes.get("/", userController.getUsers)


module.exports = routes
