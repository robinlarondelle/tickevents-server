const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticket = db.define("Tickets", {
  TicketID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  EventID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Events",
      key: "EventID"
    },
    allowNull: false
  },
  PaymentReceived: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  BoughtBy: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "UserID"
    },
    allowNull: true,
    defaultValue: null
  },
  Price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
})

module.exports = ticket;