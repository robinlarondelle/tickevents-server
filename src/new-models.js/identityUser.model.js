const mongoose = require('mongoose')
const { isEmail } = require("validator") //Validator is an NPM package to validate input

const identityUserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        validate: {
            validator: (email) => isEmail(email),
            message: "Please provide a valid email"
        }
    },

    firstname: {
        type: String,
        required: [true, 'firstname is required']
    },

    lastname: {
        type: String,
        required: [true, 'lastname is required']
    },

    role: {
        type: String,
        enum: ["customer", "organizer", "admin"],
        required: [true, 'role is required'],
        default: "customer"
    },

    emailConfirmed: {
        type: Boolean,
        default: false
    },

    password: {
        type: String
    }
})

module.exports = mongoose.model("identityUser", identityUserSchema)
