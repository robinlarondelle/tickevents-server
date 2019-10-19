const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticket = db.define("Tickets", {
  ticketID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  ticketTypeID: {
    type: Sequelize.INTEGER,
    references: {
      model: "TicketTypes",
      key: "ticketTypeID"
    }
  },

  boughtBy: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "userID"
    },
    allowNull: true,
    defaultValue: null,
    comment: "Can be null when ticket hasn't been sold yet"
  },

  paymentReceived: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  reservated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  reservatedUntil: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: null
  }
})

module.exports = ticket;