const mongoose = require('mongoose')

const ticketTypeSchema = mongoose.Schema({
    eventID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: [true, 'eventID is required']
    },

    name: {
        type: String,
        required: [true, 'name is required']
    },

    availability: {
        type: Number,
        required: [true, 'availability is required'],
        validate: {
            validator: (availability) => availability > 1,
            message: 'Please provide a availability of 1 or more'
        }
    },

    pricePerTicket: {
        type: Number,
        validate: {
            validator: (availability) => availability > 1,
            message: 'Please provide a pricePerTicket of 1 or more'
        }
    }
})

module.exports = mongoose.model('ticketType', ticketTypeSchema)
