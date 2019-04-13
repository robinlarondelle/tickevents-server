const Sequelize = require("sequelize")
const db = require("../config/models-database")

const user = db.define("users", {
  USER_ID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  FIRSTNAME: {
    type: Sequelize.STRING,
    allowNull: false
  },

  MIDDLENAME: {
    type: Sequelize.STRING,
    allowNull: true
  },

  LASTNAME: {
    type: Sequelize.STRING,
    allowNull: false
  },

  GENDER: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [['Male', 'Female', 'Other']]
    }
  },

  ADDRESS: {
    type: Sequelize.STRING,
    validate: { //Only dutch streetnames for now: [Streetname] + [HouseNR]
      is: /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i
    },
    allowNull: false
  },

  ZIPCODE: { //Only dutch zipcodes for now: [AAAA 11]
    type: Sequelize.STRING,
    validate: {
      is: /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i
    },
    allowNull: false
  },

  CITY: {
    type: Sequelize.STRING,
    allowNull: false
  },

  COUNTRY: {
    type: Sequelize.STRING,
    allowNull: false
  },

  MOB_PHONE_NUMBER: {
    type: Sequelize.STRING,
    validate: { //Only Dutch 06 phone numbers work for now
      is: /^(((\\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i
    },
    allowNull: false
  },

  HOME_PHONE_NUMBER: {
    type: Sequelize.STRING,
    validate: {
      is: /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/
    },
    allowNull: true
  },

  IBAN: {
    type: Sequelize.STRING,
    validate: { //Only dutch banks for now
      is: /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/
    },
    allowNull: false
  },
})

module.exports = user;