const routes = require('express').Router();
const TicketController = require("../controllers/ticket.controller")

routes.get(`/`, TicketController.getTickets)
routes.get(`/:eventid/`, TicketController.getTicketsFromEvent)
routes.get(`/:ticketid`, TicketController.getTicketByID)
routes.get(`/purchase`, TicketController.purchaseTicket)

module.exports = routes
