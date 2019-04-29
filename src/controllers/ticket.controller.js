const Ticket = require("../models/ticket.model")

module.exports = {
  getTickets(req, res, next) {
    res.status(503).json({message: "Not Implemented Yet"}).end()
  },

  getTicketsFromEvent(req, res, next) {
    res.status(503).json({message: "Not Implemented Yet"}).end()
  },

  getTicketByID(req, res, next) {
    res.status(503).json({message: "Not Implemented Yet"}).end()
  },

  purchaseTicket(req, res, next){
  res.status(503).json({message: "Not Implemented Yet"}).end()
  }
}