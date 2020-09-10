const mongoose = require('mongoose')
const { isEmail } = require("validator") //Validator is an NPM package to validate input

const customerSchema = mongoose.Schema({
    firstname: {
        type: String,
        min: 2,
        max: 50
    },

    lastname: {
        type: String,
        min: 2,
        max: 50
    },

    email: {
        type: String,
        validate: [{
            validator: (email) => isEmail(email),
            message: "Please provide a valid email"
        }] 
    }
})

module.exports = mongoose.model('customer', customerSchema)