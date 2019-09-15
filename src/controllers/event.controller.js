const moment = require("moment")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ErrorMessage = require("../models/error-message.model")
const Event = require("../models/event.model")
const User = require("../models/user.model")
const Ticket = require("../models/ticket.model")
const validator = require("../util/validator")

module.exports = {

  getAllEvents(req, res, next) {
    Event.findAll().then(events => {
      res.status(200).json({events}).end()
    })
  },


  getEventById(req, res, next) {
    Event.findByPk(req.params.id).then(event => {
      if (event) res.status(200).json(event).end()
      else next(new ErrorMessage("NoEventFoundError", `No Events with ID ${req.params.id} found!`, 200))
    })
  },

  getEventTypesById(req, res, next) {
    res.status(501).end()

  },


  getTicketsForEvent(req, res, next) {
    Ticket.findAll({where: { EventID : req.params.EventID}}).then(tickets => {
      if (tickets.length !== 0) {
        res.status(200).json(tickets).end()
      } else {
        next(new ErrorMessage("NoTicketsFoundError", `No Tickets found for EventID ${req.params.EventID}`, 200))
      }
    })
  },

  //TODO: Get all active Events

  //TODO: Get all Events from one User

  //TODO: Get all sold Tickets from Event


  createEvent(req, res, next) {
    const { email, eventName, eventVenue, venueAddress, venueZipcode, venueCity, venueCountry, eventDate, capacity, pricePerTicket } = req.body

    //Check request body
    //TODO: Remove check to Validator Util
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
              }).catch(err => next(new ErrorMessage("CreateEventError", `${err}`, 400)))
            } else next(new ErrorMessage("NoUserFoundError", `No user with email ${email} found in database. Please register first`, 200))
          }).catch(err => next(new ErrorMessage("NoUserFoundError", `${err}`, 200)))
        } else next(new ErrorMessage("DuplicateEventNameError", `Event with name ${eventName} already exists. Please create a new name`, 200))
      }).catch(err => next(new ErrorMessage("FindEventError", `${err}`, 400)))

      //TODO: Update Error message to something usefull like what needs to be placed in the request body
    } else next(new ErrorMessage("FaultyRequestBodyError", `Request body not correct`, 400))
  },

  //TODO: Create purchase Ticket endpoint
  purchaseTicketforEvent(req, res, next) {

    validator.validatePurchaseTicketBody(req.body).then(() => {
      const {
        name,
        email,
        dateOfBirth,
        purchase,
        eventID,
      } = body

      User.findOne({where: {UserID: userID}}).then(user => {


        
        (async () => {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              name: productName,
              description: 'Comfortable cotton t-shirt',
              images: ['https://example.com/t-shirt.png'],
              amount: 500,
              currency: 'eur',
              quantity: 1,
            }],
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
          });
        })();

        
        

        res.end()
      }).catch(e => next(ErrorMessage("LookupModelUserError", e, 400)))

    //Check if user exists in database, if not, request user to register

    //Check if the Event hasn't expired, e.g. the Event hasn't started yet, if so, notify the user that he is too late

    //Check if there are available tickets to purchase for this Event, if not, notify the user that the Event has sold out

      //Reservate tickets

      //Event available
      //Tickets avaiable

      //Create a request to Stripe implementation to handle the purchase

      //TODO: Do research on Stripe and how their payment process works
      
        //Assign Tickets to user
        //Return new Tickets





    //TODO: Send tickets to email when purchase was a success

  }).catch(e => next(new ErrorMessage(`${e}`, 400)))

  },




  //TODO: Assign a Ticket from a Event to a User without any payment required





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
            }).catch(err => next(new ErrorMessage("EventUpdateError", `${err}`, 400)))
          } else next(new ErrorMessage("NoEventFoundError", `No Events with ID ${id} found!`, 200))
        }).catch(err => next(new ErrorMessage("EventFetchingError", `${err}`, 400)))
      } else next(new ErrorMessage("InvalidDateError", `New EventDate cant be on this day`, 400))

      //TODO: Update Error message to something usefull like what needs to be placed in the request body
    } else next(new ErrorMessage("FaultyRequestBodyError", `Request body not correct`, 400))
  },


  //Update capacity of an event. Creates new tickets when the requested capacity is higher than the current capacity
  //Deletes unsold tickets when the requested capacity is lower than the actual capacity. If there are too much tickets sold
  //(e.g. need to delete more tickets than available), there will be an error thrown, and the user is expected to increase the
  //Capacity request.
  updateCapacity(req, res, next) {
    const { capacity } = req.body
    const eventID = req.params.id

    if (capacity && capacity != 0) { //Check if body is correct
      Event.findByPk(eventID).then(event => {
        const ticketDifference = capacity - event.Capacity //Calculate the amount of tickets to generate or delete

        if (ticketDifference === 0) {
          res.status(200).json({ message: `No changes made. Capacity was already ${capacity}.` }).end()

        } else if (ticketDifference > 0) { //Request to increase capacity, so there need to be more tickets created
          for (let i = 0; i < ticketDifference; i++) { //Create as much tickets to match the new capacity
            Ticket.create({
              EventID: event.EventID,
              Price: event.PricePerTicket
            })
          }

          event.update({ Capacity: capacity }).then(result => { //Set actual capacity to requested capacity
            res.status(200).json(result).end()
          }).catch(err => next(new ErrorMessage("UpdateEventError", `${err}`, 400)))

        } else if (ticketDifference < 0) { //Request to decrease capacity, so deleting unsold tickets to match capacity
          Ticket.findAll({ //Get all tickets that can potentially be deleted
            where: {
              PaymentReceived: false,
              EventID: eventID
            }
          }).then(tickets => {

            //Check if there are more tickets unsold than tickets that need to be deleted
            //If there are enough tickets available to delete, the difference between actual capacity and request capacity
            //is Deleted
            if (tickets.length - (ticketDifference * -1) > 0) { //There are enough tickets to delete
              Ticket.destroy({
                where: {
                  PaymentReceived: false,
                  EventID: eventID
                }, limit: ticketDifference * -1 //Only delete the amount needed to equal the capacity
              }).then(() => {

                event.update({ Capacity: capacity }).then(result => { //Set actual capacity to requested capacity
                  res.status(200).json(result).end()
                }).catch(err => next(new ErrorMessage("UpdateEventError", `${err}`, 400)))
              }).catch(err => next(new ErrorMessage("DestroyTicketsError", `${err}`, 400)))

              // The update cant go through because there are too many tickets sold
            } else next(new ErrorMessage("TooManyTicketsSoldError", `There are too many tickets sold to lower Capacity. Please increase capacity`, 400))
          }).catch(err => next(new ErrorMessage("TicketFetchingError", `${err}`, 400)))
        }
      }).catch(err => next(new ErrorMessage("EventFetchingError", `${err}`, 400)))
    } else next(new ErrorMessage("NoCapacityError", `new capacity cant be 0`, 400))
  },


  deleteEventById(req, res, next) {
    res.status(503).end()
  }

  //TODO: Set Event non active when expired
}