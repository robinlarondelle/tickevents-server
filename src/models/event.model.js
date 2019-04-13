const Sequelize = require("sequelize")
const db = require("../config/models-database")

const event = db.define("events", {
  EVENT_ID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  USER_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: 'USER_ID'
    },
    comment: "Owner/Host of the Event"
  },

  EVENT_NAME: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  EVENT_VENUE: {
    type: Sequelize.STRING,
    allowNull: false
  },

  VENUE_ADDRESS: {
    type: Sequelize.STRING,
    validate: { //Only dutch streetnames for now: [Streetname] + [HouseNR]
      is: /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i
    },
    allowNull: false
  },

  VENUE_ZIPCODE: { //Only dutch zipcodes for now: [AAAA 11]
    type: Sequelize.STRING,
    validate: {
      is: /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i
    },
    allowNull: false
  },

  VENUE_CITY: {
    type: Sequelize.STRING,
    allowNull: false
  },

  VENUE_COUNTRY: {
    type: Sequelize.STRING,
    allowNull: false
  },

  EVENT_DATE: {
    type: Sequelize.DATE,
    allowNull: false
  },

  CAPACITY: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 0
  }
})



module.exports = event;