require("dotenv").config({ path: "./environment/environment.env" }) //Get the environment file
console.log("\nAPI running in " + process.env.NODE_ENV + " mode \n")

const express = require('express') //HTTP request framework
const morgan = require("morgan")
const bodyParser = require('body-parser') //Pase request body to JSON
const passport = require("./config/passport/passport") // Passport.js to secure the API
const jwt = require("jsonwebtoken")

const modelDb = require("./config/models-database")
const identityDb = require("./config/identity-database")
const ApiMessage = require("./util/ApiMessage")
const port = process.env.PORT || "3000"
const app = express()
const forceDatabaseReset = false; //Tell Seuqelize to drop all data and update table structure    

  
// Setup express app
app.use(bodyParser.json()) //Parse request body to JSON
if (process.env.NODE_ENV === "development") app.use(morgan("dev")) //Log requests to console if in development
app.use(passport.initialize())


// Routes
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const ticketRoutes = require("./routes/ticket.routes")
const eventRoutes = require("./routes/event.routes")


// Unsecured Endpoints
app.use("/api", authRoutes)

//TODO move secured endpoints below endpoint security

//Secured endpoints
app.use("/api/users", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/events", eventRoutes)

//Endpoint security middleware using jwt
app.use("*", function (req, res, next) {
  const token = req.headers["x-access-token"] //Fetch token from header
  if (token) {

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (!err) {
        req.payload = decoded //Set payload as a request property to use later
        next()
      } else next(new ApiMessage("Error: " + err, 401))
    })

  } else next(new ApiMessage("No token provided. Access denied", 401))
})




//Catch all non existing endpoints
app.use("*", function (req, res, next) {
  next(new ApiMessage("Endpoint not found", 404, Date.now()))
})


//Error endpoint
app.use((err, req, res, next) => {
  res.status(err.status || 404).json(err).send();
})


//Sync the database first, then run the server
modelDb.sync({ force: forceDatabaseReset, logging: false }).then(() => {
  console.log(`Models database Synced successfully. Reset Database: ${forceDatabaseReset}`)
  identityDb.sync({ force: forceDatabaseReset, logging: false }).then(() => {
    console.log(`Identity database Synced successfully. Reset Database: ${forceDatabaseReset}\n`)

    //Setup server on designated port
    app.listen(port, () => console.log("Server is running on port: " + port))

  }).catch(err => console.log("\n\nAn error occured when syncing the identity database: \n\n" + err))
}).catch(err => console.log("\n\nAn error occured when syncing the database: \n\n" + err))

module.exports = app
