const Ticket = require("../models/ticket.model")
const ErrorMessage = require("../models/error-message.model")

module.exports = {

  getTickets(req, res, next) {
    Ticket.findAll().then(tickets => {
      res.status(200).json(tickets).end()
    })
  },


  getTicketByID(req, res, next) {
    Ticket.findByPk({where: { ticketID : req.params.ticketID}}).then(ticket => {
      if (ticket) {
        res.status(200).json(ticket).end()
      } else {
        next(new ErrorMessage("NoTicketsFoundError", `No Tickets found for EventID ${req.params.EventID}`, 400))
      }
    })
  }

  //TODO: Get all Tickets from a User

  //TODO: Create download Endpoint to download Tickets in PDF form
}