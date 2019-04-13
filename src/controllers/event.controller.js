const ApiMessage = require("../util/ApiMessage")
const Event = require("../models/event.model")

module.exports = {
  getAllEvents (req, res, next) {
    res.status(503).end()
  },

  getEventById(req, res, next) {
    res.status(503).end()
  },

  createEvent(req, res, next) {
    res.status(503).end()
  },

  editEventById(req, res, next) {
    res.status(503).end()
  },

  deleteEventById(req, res, next) {
    res.status(503).end()
  }
}