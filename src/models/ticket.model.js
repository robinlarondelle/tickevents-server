const Sequelize = require("sequelize")
const db = require("../config/models-database")

const ticket = db.define("Tickets", {
  TicketID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  TicketTypeID: {
    type: Sequelize.INTEGER,
    references: {
      model: "TicketTypes",
      key: "TicketTypeID"
    }
  },

  // Havent decided yet if i want to use this value
  // EventID: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: "Events",
  //     key: "EventID"
  //   }
  // },

  BoughtBy: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: "UserID"
    },
    allowNull: true,
    defaultValue: null,
    comment: "Can be null when ticket hasn't been sold yet"
  },

  PaymentReceived: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  Reservated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  ReservatedUntil: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: null
  }
})

module.exports = ticket;