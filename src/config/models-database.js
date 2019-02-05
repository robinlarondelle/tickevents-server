const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || "development"
const config = require("../config/config.json")[env].models // Get the object matching the current NODE_ENV

//Setup Sequelize witht the config credentials
module.exports = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)