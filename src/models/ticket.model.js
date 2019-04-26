const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticket = db.define("Tickets", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
})

module.exports = ticket;