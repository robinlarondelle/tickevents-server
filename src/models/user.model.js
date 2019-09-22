const Sequelize = require("sequelize")
const db = require("../config/models-database")

const user = db.define("Users", {
  userID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },

  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  middleName: {
    type: Sequelize.STRING,
    allowNull: true
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  gender: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isIn: [['Male', 'Female', 'Other']]
    }
  },

  
  address: {
    type: Sequelize.STRING,
    validate: { //Only dutch streetnames for now: [Streetname] + [HouseNR]
      is: /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i
    },
    allowNull: true
  },

  zipcode: { //Only dutch zipcodes for now: [AAAA 11]
    type: Sequelize.STRING,
    validate: {
      is: /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i
    },
    allowNull: true
  },

  city: {
    type: Sequelize.STRING,
    allowNull: true
  },

  country: {
    type: Sequelize.STRING,
    allowNull: true
  },

  phoneNumber: {
    type: Sequelize.STRING,
    validate: { //Only Dutch 06 phone numbers work for now
      is: /^(((\\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i
    },
    allowNull: true
  },

  IBAN: {
    type: Sequelize.STRING,
    validate: { //Only dutch banks for now
      is: /^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}$/
    },
    allowNull: true
  },
})

module.exports = user;