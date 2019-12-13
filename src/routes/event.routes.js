const routes = require('express').Router();
const eventController = require("../controllers/event.controller")

routes.get("/", eventController.getAllEvents)
routes.get("/:id", eventController.getEventById)
routes.get("/:id/types", eventController.getEventTypesById)
// routes.get("/:EventID/tickets", eventController.getTicketsForEvent) //DEPRECATED
routes.post("/", eventController.createEvent)
routes.post("/:id/purchase", eventController.purchaseTicketforEvent)
routes.post("/:id/initialize-purchase", eventController.initializePurchase)
routes.put("/:id", eventController.editEventById)
routes.put("/:id/capacity", eventController.updateCapacity)
routes.delete("/:id", eventController.deleteEventById)

module.exports = routes
