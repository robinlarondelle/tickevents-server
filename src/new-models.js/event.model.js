const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({

    //Every event has to be owned by a Organizer
    organizerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizers',
        required: [true, 'organizerID is required']
    },

    //The name of the event
    name: {
        type: String,
        validate: [{
            validator: (name) => name.length >= 2,
            message: 'The minimum name length is 2 characters'
        }, {
            validator: (name) => name.length <= 55,
            message: 'The maximum name length is 55 characters'
        }],
        required: [true, 'A name for the Event is required']
    },

    //The event description, which contains all the necessairy information for customers
    description: {
        type: String,
        required: [true, 'description is required']
    },

    //The date when the event is held
    date: {
        type: Date,
        required: [true, 'date is required']
    },

    //The venue name of the event
    venueName: {
        type: String,
        validate: [{
            validator: (name) => name.length >= 2,
            message: 'The minimum venueName length is 2 characters'
        }, {
            validator: (name) => name.length <= 55,
            message: 'The maximum venueName length is 55 characters'
        }],
        required: [true, 'venueName is required']
    },

    //The address of the venue
    venueAddress: {
        type: String,
        required: [true, 'venueAddress is required']
    },

    //The city of the Venue
    venueCity: {
        type: String,
        required: [true, 'venueCity is required']
    },

    //The country of the Venue
    venueCountry: {
        type: String,
        required: [true, 'venueCountry is required']
    }
}, {
    versionKey: false
})

module.exports = mongoose.model("event", eventSchema)