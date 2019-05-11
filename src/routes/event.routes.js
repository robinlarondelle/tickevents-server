const routes = require('express').Router();
const eventController = require("../controllers/event.controller")

routes.get("/", eventController.getAllEvents)
routes.get("/:id", eventController.getEventById)
routes.get("/:EventID/tickets", eventController.getTicketsForEvent)
routes.post("/", eventController.createEvent)
routes.post("/:EventID/purchase", eventController.purchaseTicketforEvent)
routes.put("/:id", eventController.editEventById)
routes.put("/:id/capacity", eventController.updateCapacity)
routes.delete("/:id", eventController.deleteEventById)

module.exports = routes
