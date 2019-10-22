const routes = require('express').Router()
const identityController = require("../controllers/identity.controller")
const validator = require("../util/route-protector")

routes.get("/:id/:token", validator.getIdentityUserByIDProtetcion, identityController.getIdentityUserByID)

module.exports = routes
