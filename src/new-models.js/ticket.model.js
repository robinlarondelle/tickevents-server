const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema({
    //The Event to which the ticket belongs
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: [true, 'eventID is required']
    },

    //The type of ticket
    ticketTypeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticketTypeID',
        required: [true, 'ticketTypeID is required']
    },

    isReservated: {
        type: Boolean,
        default: false,
    },

    reservationTime: {
        type: Date
    }
})

module.exports = mongoose.model('ticket', ticketSchema)