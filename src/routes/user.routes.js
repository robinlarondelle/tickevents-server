const routes = require('express').Router()
const userController = require("../controllers/user.controller")
const jwt = require('express-jwt')
const auth = jwt({  
  secret: process.env.SECRET,
  requestProperty: 'payload'
})

routes.get("/", auth, userController.getUsers)


module.exports = routes
