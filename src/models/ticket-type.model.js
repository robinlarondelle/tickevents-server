const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticketTypes = db.define('TicketTypes', {
  ticketTypeID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  eventID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Events",
      key: 'eventID'
    },
    allowNull: false
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false
  },

  availability: {
    type: Sequelize.INTEGER,
    allowNull: false,  
  },

  pricePerTicket: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: 'Value of ticket in cents EUR'
  }
})

module.exports = ticketTypes