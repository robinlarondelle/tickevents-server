const passport = require("passport")
const ApiMessage = require("../models/ApiMessage")
const Sequelize = require("sequelize")
const db = require("../config/database")
const User = require("../models/user.model")
const Ticket = require("../models/ticket.model")
const Event = require("../models/event.model")

module.exports = {
  login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (!err) {
        if (user) {
          res.status(200).json({ token: user.generateToken() }).end()
        } else next(new ApiMessage("Geen gebruiker gevonden. info: " + info, 404))
      } else next(new ApiMessage("Error: " + err, 400))
    })(req, res)
  },

  login1(req, res, next) {
    User.findAll().then(users => {
      Ticket.findAll().then(tickets => {
        Event.findAll().then(events => {
          res.status(200).send(
            {
              message: "Hello",
              users: users,
              tickets: tickets,
              events: events
            }).end()
        })
      })
    })
  }
}