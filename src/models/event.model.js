const Sequelize = require("sequelize")
const db = require("../config/models-database")

const event = db.define("Events", {
  eventID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userID: {
    type: Sequelize.INTEGER,
    references: {
      model: "Users",
      key: 'userID'
    },
    comment: "Owner/Host of the Event"
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },

  date: {
    type: Sequelize.DATE,
    allowNull: false
  },

  venue: {
    type: Sequelize.STRING,
    allowNull: false
  },

  venueAddress: {
    type: Sequelize.STRING,
    validate: { //Only dutch streetnames for now: [Streetname] + [HouseNR]
      is: /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i
    },
    allowNull: false
  },

  venueZipcode: { //Only dutch zipcodes for now: [AAAA 11]
    type: Sequelize.STRING,
    validate: {
      is: /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i
    },
    allowNull: false
  },

  venueCity: {
    type: Sequelize.STRING,
    allowNull: false
  },

  venueCountry: {
    type: Sequelize.STRING,
    allowNull: false
  },

  venueCapacity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  //TODO: Add Active status
})



module.exports = event;