const routes = require('express').Router();
const TicketController = require("../controllers/ticket.controller")

routes.get(`/`, TicketController.getTickets)

module.exports = routes
