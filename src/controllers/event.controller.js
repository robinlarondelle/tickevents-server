const ApiMessage = require("../util/ApiMessage")
const Event = require("../models/event.model")
const User = require("../models/user.model")

module.exports = {
  getAllEvents(req, res, next) {
    Event.findAll().then(events => {
      res.status(200).json(events).end()
    })
  },

  //TODO change response when nothing found
  getEventById(req, res, next) {
    Event.findByPk(req.params.id).then(event => {
      res.status(200).json(event).end()
    })
  },


  createEvent(req, res, next) {
    const body = req.body
    const user_email = req.body.UserEmail
    const date = body.EventDate
    console.log(date);
    

    User.findOne({ where: { email: user_email } }).then(user => {      
      Event.findOrCreate({
        where: { EventName: body.EventName },
        defaults: {
          UserID: user.UserID,
          EventVenue: body.EventVenue,
          VenueAddress: body.VenueAddress,
          VenueZipcode: body.VenueZipcode,
          VenueCity: body.VenueCity,
          VenueCountry: body.VenueCountry,
          EventDate: body.EventDate,
          Capacity: body.Capacity
        }
      }).then(([event, created]) => {
        if (created) {
          res
            .status(201)
            .json(new ApiMessage({
              "event-created": "success",
              event: event
            }, 201))
            .end()

        } else {
          res
            .status(200)
            .json(new ApiMessage(`Event with name ${body.EventName} already exists`, 200))
            .end()
        }
      }).catch(err => {
        console.log(`Error occured: \n\n ${err}`);
      })
    })
  },

  //TBD
  editEventById(req, res, next) {
    res.status(503).end()
  },

  //TBD
  deleteEventById(req, res, next) {
    res.status(503).end()
  }
}