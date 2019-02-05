require("dotenv").config({ path: "./environment/environment.env" }) //Get the environment file
console.log("API running in " + process.env.NODE_ENV + " mode")

const express = require('express') //HTTP request framework
const morgan = require("morgan")
const bodyParser = require('body-parser') //Pase request body to JSON
const passport = require("passport") // Passport.js to secure the API

const modelDb = require("./config/models-database")
const identityDb = require("./config/identity-database")
const port = process.env.PORT || "3000"
const app = express()

// Setup express app
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(passport.initialize())


// If in development mode, we want to force dropping of tables
if (process.env.NODE_ENV === "development") {
  modelDb.sync({force: true, logging: false}).then(() => { //Dropping all tables first, then adding them again
    identityDb.sync({force: true, logging: false}).then(() => {
      console.log("Models database Synced successfully")
      console.log("Identity database Synced successfully")
    }).catch(err => console.log("An error occured when syncing the identity database: \n\n" + err))
  }).catch(err => console.log("An error occured when syncing the database: \n\n" + err))
} else {
  modelDb.sync({force: false, logging: false}).then(() => { //Just update tables, dont drop data!
    identityDb.sync({force: false, logging: false}).then(() => {
      console.log("Models database Synced successfully")
      console.log("Identity database Synced successfully")
    }).catch(err => console.log("An error occured when syncing the identity database: \n\n" + err))
  }).catch(err => console.log("An error occured when syncing the database: \n\n" + err))
}

// Routes
const authRoutes = require("./routes/auth.routes")
const ticketRoutes = require("./routes/ticket.routes")
const eventRoutes = require("./routes/event.routes")

// Endpoints
app.use("/api", authRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/events", eventRoutes)

//Catch all non existing endpoints
app.use("*", function (req, res, next) {
  next(new ApiError("Endpoint not found", 404, Date.now()))
})

//Error endpoint
app.use((err, req, res, next) => {
  res.status(err.code || 404).json(err).send();
})

//Setup server on designated port
app.listen(port, () => {
  console.log("Server is running on port: " + port)
})

module.exports = app
