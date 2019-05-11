const Ticket = require("../models/ticket.model")
const ApiMessage = require("../util/ApiMessage")

module.exports = {

  getTickets(req, res, next) {
    Ticket.findAll().then(tickets => {
      res.status(200).json(tickets).end()
    })
  },


  getTicketByID(req, res, next) {
    Ticket.findByPk({where: { TicketID : req.params.TicketID}}).then(ticket => {
      if (ticket) {
        res.status(200).json(ticket).end()
      } else {
        next(new ApiMessage(`NoTicketsFoundError: No Tickets found for EventID ${req.params.EventID}`, 200))
      }
    })
  }
}