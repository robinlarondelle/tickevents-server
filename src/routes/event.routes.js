const routes = require('express').Router();
const eventController = require("../controllers/event.controller")

routes.get("/", eventController.getAllEvents)
routes.get("/:id", eventController.getEventById)

module.exports = routes
