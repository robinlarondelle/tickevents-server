const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticket = db.define("ticket", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
})

module.exports = ticket;