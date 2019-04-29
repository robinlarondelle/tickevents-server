const moment = require("moment")

const ApiMessage = require("../util/ApiMessage")
const Event = require("../models/event.model")
const User = require("../models/user.model")
const Ticket = require("../models/ticket.model")

module.exports = {
  getAllEvents(req, res, next) {
    Event.findAll().then(events => {
      res.status(200).json(events).end()
    })
  },

  //TODO change response when nothing found
  getEventById(req, res, next) {
    Event.findByPk(req.params.id).then(event => {
      if (event) res.status(200).json(event).end()
      else next(new ApiMessage(`NoEventFoundError: No Events with ID ${req.params.id} found!`, 200))
    })
  },


  createEvent(req, res, next) {
    const { email, eventName, eventVenue, venueAddress, venueZipcode, venueCity, venueCountry, eventDate, capacity, pricePerTicket } = req.body

    //Check request body
    if (email && eventName && eventVenue && venueAddress && venueZipcode && venueCity && venueCountry && eventDate && capacity && pricePerTicket) {
      Event.findOne({ where: { EventName: eventName } }).then(dbEvent => {
        if (!dbEvent) {
          //check if users email is known
          User.findOne({ where: { Email: email } }).then(dbUser => {
            if (dbUser) {

              const createEvent = Event.build({
                UserID: dbUser.UserID,
                EventName: eventName,
                EventVenue: eventVenue,
                VenueAddress: venueAddress,
                VenueZipcode: venueZipcode,
                VenueCity: venueCity,
                VenueCountry: venueCountry,
                EventDate: eventDate,
                Capacity: capacity
              })

              createEvent.save().then(createResponse => {
                const newEvent = createResponse

                //Create as much tickets as there is capacity
                for (let i = 0; i < createResponse.Capacity; i++) {
                  Ticket.create({
                    EventID: newEvent.EventID,
                    PaymentReceived: false,
                    BoughtBy: null,
                    Price: pricePerTicket
                  })
                }

                res.status(201).json(createResponse).end()
              }).catch(err => next(new ApiMessage(`Error: ${err}`)))
            } else next(new ApiMessage(`No user with email ${email} found in database. Please register first`, 200))
          }).catch(err => next(new ApiMessage(`Error: ${err}`, 200)))
        } else next(new ApiMessage(`Event with name ${eventName} already exists. Please create a new name`, 200))
      }).catch(err => next(new ApiMessage(`Error: ${err}`)))
    } else next(new ApiMessage(`Request body not correct`, 200))
  },


  editEventById(req, res, next) {
    const { eventName, eventVenue, venueAddress, venueZipcode, venueCity, venueCountry, eventDate } = req.body
    const id = req.params.id
    const newEventDate = moment(eventDate)    

    if (eventName && eventVenue, venueAddress, venueZipcode, venueCity, venueCountry, eventDate) {      
      if (newEventDate.diff(moment(), 'days') > 0) {
        Event.findByPk(req.params.id).then(event => {
          if (event) {
            event.update({
              EventName: eventName,
              EventVenue: eventVenue,
              VenueAddress: venueAddress,
              VenueZipcode: venueZipcode,
              VenueCity: venueZipcode,
              VenueCountry: venueCountry,
              EventDate: eventDate
            }).then(res1 => {
              res.status(200).json(res1).end()
            }).catch(err => next(new ApiMessage(`Error when updating event: ${err}`)))
          } else next(new ApiMessage(`NoEventFoundError: No Events with ID ${id} found!`, 200))
        }).catch(err => next(new ApiMessage(`Error when fetching event: ${err}`)))
      } else next(new ApiMessage(`InvalidDateError: New EventDate cant be on this day`))
    } else next(new ApiMessage(`Request body not correct`, 200))
  },


  updateCapacity(req, res, next) {
    res.status(503).end()
  },


  deleteEventById(req, res, next) {
    res.status(503).end()
  }
}