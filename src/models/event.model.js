const Sequelize = require("sequelize")
const db = require("../config/database")

const event = db.define("event", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  }
})

module.exports = event;