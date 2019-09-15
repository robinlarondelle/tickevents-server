//Decide what environment file to use
if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: "./environment/dev.environment.env" })
  console.log("\nAPI running in " + process.env.NODE_ENV + " mode \n")

} else if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: "./environment/prod.environment.env" })
  console.log("\nAPI running in " + process.env.NODE_ENV + " mode \n")
}


//Packages import
const express = require('express') //HTTP request framework
const morgan = require("morgan") //HTTP request logger
const bodyParser = require('body-parser') //Pase request body to JSON
const jwt = require('jsonwebtoken');
const cors = require("cors") // Access control
const fs = require('fs')



//Local imports
const passport = require("./config/passport/passport") // Passport.js to secure the API
const modelDb = require("./config/models-database")
const identityDb = require("./config/identity-database")
const ErrorMessage = require("./models/error-message.model")
const port = process.env.PORT || "3000"
const app = express()


//Parameters
const forceDatabaseReset = false; //Tell Seuqelize to drop all data and update table structure    
const seedDatabase = false; //Fill the database with fake data


// Setup express app
app.use(bodyParser.json()) //Parse request body to JSON
if (process.env.NODE_ENV === "development") app.use(morgan("dev")) //dont show all logs when in production mode
app.use(passport.initialize())
app.use(cors('*')) //TODO: set access to only Angular and Flutter Applications


// Routes
const authRoutes = require("./routes/auth.routes")
const tokenRoutes = require(`./routes/token.routes`)
const userRoutes = require("./routes/user.routes")
const ticketRoutes = require("./routes/ticket.routes")
const eventRoutes = require("./routes/event.routes")


// Unsecured Endpoints
app.use("/api", authRoutes)


// Endpoint authentication Middleware
app.use( "*", (req, res, next) => {  
  let token = req.headers['authorization']
  token = token.split(" ")[1] // remove Bearer from token and get token part from .split() array  

  try {
    fs.readFile('environment/keys/public_key.pem', (err, key) => {      
      if (err) next(new ErrorMessage("PublicKeyFetchError", err, 400))
      else {     
        try {
          const payload = jwt.verify(token, Buffer.from(key).toString())
          req.payload = payload
          next()
        } catch (err) {
          next(new ErrorMessage("JWTTokenExpired", err, 401))
        }
      }
    })
  } catch (err) {
    next(err)
  }
})



//Secured endpoints
app.use(`/api/tokens`, tokenRoutes)
app.use("/api/users", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/events", eventRoutes)
//TODO: Add Logging endpoint



//Catch all non existing endpoints
app.use("*", function (req, res, next) {
  next(new ErrorMessage("EndpointNotFoundError", "Endpoint not found", 404))
})


//Error middleware
app.use((err, req, res, next) => {
  res.status(err.status || 404).json(err).send();
})


//Sync the database first, then run the server
modelDb.sync({ force: forceDatabaseReset, logging: false }).then(() => {
  console.log(`Models database Synced successfully.   || Reset Database: ${forceDatabaseReset}. Reseeded Database: ${seedDatabase}.`)
  identityDb.sync({ force: forceDatabaseReset, logging: false }).then(() => {
    console.log(`Identity database Synced successfully. || Reset Database: ${forceDatabaseReset}. Reseeded Database: ${seedDatabase}.\n`)

    //make sure the development tables have seeddata in it
    if (process.env.NODE_ENV === "development" && seedDatabase) require("./util/database-seeder").seeddatabase()

    //Setup server on designated port
    app.listen(port, () => console.log("Server is running on port: " + port + "\n"))
    return null
  }).catch(err => console.log("\n\nAn error occured when syncing the identity database: \n\n" + err))
  return null 
}).catch(err => console.log("\n\nAn error occured when syncing the database: \n\n" + err))


module.exports = app
