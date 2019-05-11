const routes = require('express').Router();
const TicketController = require("../controllers/ticket.controller")

routes.get(`/`, TicketController.getTickets)
routes.get(`/:TicketID`, TicketController.getTicketByID)

module.exports = routes
