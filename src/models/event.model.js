const Sequelize = require("sequelize")
const db = require("../config/models-database")

const event = db.define("Events", {
  EventID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  UserID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: 'UserID'
    },
    comment: "Owner/Host of the Event"
  },

  Name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  Description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  Date: {
    type: Sequelize.DATE,
    allowNull: false
  },

  Venue: {
    type: Sequelize.STRING,
    allowNull: false
  },

  VenueAddress: {
    type: Sequelize.STRING,
    validate: { //Only dutch streetnames for now: [Streetname] + [HouseNR]
      is: /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i
    },
    allowNull: false
  },

  VenueZipcode: { //Only dutch zipcodes for now: [AAAA 11]
    type: Sequelize.STRING,
    validate: {
      is: /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i
    },
    allowNull: false
  },

  VenueCity: {
    type: Sequelize.STRING,
    allowNull: false
  },

  VenueCountry: {
    type: Sequelize.STRING,
    allowNull: false
  },

  Capacity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  PricePerTicket: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }

  //TODO: Add Active status
})



module.exports = event;