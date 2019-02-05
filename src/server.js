require("dotenv").config({path: "./environment/environment.env"}) //Get the environment file
console.log("API running in " + process.env.NODE_ENV + " mode")

const express = require('express') //HTTP request framework
const morgan = require("morgan")
const bodyParser = require('body-parser') //Pase request body to JSON
const passport = require("passport") // Passport.js to secure the API

const port = process.env.PORT || "3000"
const app = express() 

// Setup express app
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(passport.initialize())

// Routes
const authRoutes = require("./routes/auth.routes")

// Endpoints
app.use("/api", authRoutes)

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
