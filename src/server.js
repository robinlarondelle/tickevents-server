require("dotenv").config({ path: "./environment/environment.env" }) //Get the environment file
console.log("API running in " + process.env.NODE_ENV + " mode")

const express = require('express') //HTTP request framework
const morgan = require("morgan")
const bodyParser = require('body-parser') //Pase request body to JSON
const passport = require("./config/passport/passport") // Passport.js to secure the API
const session = require("express-session") // Use a session to manage users

const modelDb = require("./config/models-database")
const identityDb = require("./config/identity-database")
const ApiMessage = require("./util/ApiMessage")
const port = process.env.PORT || "3000"
const app = express()


// Setup express app
app.use(bodyParser.json()) //Parse request body to JSON
if (process.env.NODE_ENV === "development") app.use(morgan("dev")) //Log requests to console if in development
app.use(passport.initialize())


// Routes
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const ticketRoutes = require("./routes/ticket.routes")
const eventRoutes = require("./routes/event.routes")

// Endpoints
app.use("/api", authRoutes)
// app.all("*", passport.authenticate('local'))
app.use("/api/users", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/events", eventRoutes)


//Catch all non existing endpoints
app.use("*", function (req, res, next) {
  next(new ApiMessage("Endpoint not found", 404, Date.now()))
})


//Error endpoint
app.use((err, req, res, next) => {
  res.status(err.code || 404).json(err).send();
})


// If in development mode, we want to force dropping of tables
modelDb.sync({ force: false, logging: false }).then(() => {
  console.log("Models database Synced successfully")
  identityDb.sync({ force: false, logging: false }).then(() => {
    console.log("Identity database Synced successfully")

    //Setup server on designated port
    app.listen(port, () => {
      console.log("Server is running on port: " + port)
    })

  }).catch(err => console.log("An error occured when syncing the identity database: \n\n" + err))
}).catch(err => console.log("An error occured when syncing the database: \n\n" + err))

module.exports = app
