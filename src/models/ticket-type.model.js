const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticketTypes = db.define('TicketTypes', {
  TicketTypeID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  EventID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Events",
      key: 'EventID'
    }
  },

  Availability: {
    type: Sequelize.INTEGER,
    allowNull: false,  
  }
})

module.exports = ticketTypes