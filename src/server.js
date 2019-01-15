if(process.env.NODE_ENV === "production") require("dotenv").config({path: "../environment/prod.environment.env"})
if(process.env.NODE_ENV === "development") require("dotenv").config({path: "../environment/dev.environment.env"})

const express = require('express')
const morgan = require("morgan")
const bodyParser = require('body-parser')
const passport = require("passport")

const port = process.env.PORT || "3000"
const app = express() 

const authRoutes = require("./routes/auth.routes")

app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(passport.initialize())

app.use("/api", authRoutes)

app.use("*", function (req, res, next) {
  next(new ApiError("Endpoint not found", 404, Date.now()))
})

app.use((err, req, res, next) => {
  res.status(err.code || 404).json(err).send();
})

app.listen(port, () => {
  console.log("Server is running on port: " + port)
})

module.exports = app
