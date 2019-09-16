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
    },
    allowNull: false
  },

  Name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  Availability: {
    type: Sequelize.INTEGER,
    allowNull: false,  
  },

  PricePerTicket: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: 'Value of ticket in cents EUR'
  }
})

module.exports = ticketTypes