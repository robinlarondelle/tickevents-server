const routes = require('express').Router()
const userController = require("../controllers/user.controller")

routes.get("/", userController.getUsers)
routes.get("/:id", userController.getUserById)
routes.post("/", userController.createUser)
routes.put("/:id", userController.editUserById)


module.exports = routes
