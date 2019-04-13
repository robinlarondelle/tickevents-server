const Sequelize = require("sequelize")
const db = require("../config/models-database")

const user = db.define("users", {
  User_ID: {
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },

  Email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    },
    unique: true
  },

  FirstName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  MiddleName: {
    type: Sequelize.STRING,
    allowNull: true
  },

  LastName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  Gender: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [['Male', 'Female', 'Other']]
    }
  },

  
  Address: {
    type: Sequelize.STRING,
    validate: { //Only dutch streetnames for now: [Streetname] + [HouseNR]
      is: /^([1-9][e][\s])*([a-zA-Z]+(([\.][\s])|([\s]))?)+[1-9][0-9]*(([-][1-9][0-9]*)|([\s]?[a-zA-Z]+))?$/i
    },
    allowNull: false
  },

  Zipcode: { //Only dutch zipcodes for now: [AAAA 11]
    type: Sequelize.STRING,
    validate: {
      is: /^[1-9][0-9]{3}[\s]?[A-Za-z]{2}$/i
    },
    allowNull: false
  },

  City: {
    type: Sequelize.STRING,
    allowNull: false
  },

  Country: {
    type: Sequelize.STRING,
    allowNull: false
  },

  PhoneNumber: {
    type: Sequelize.STRING,
    validate: { //Only Dutch 06 phone numbers work for now
      is: /^(((\\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/i
    },
    allowNull: false
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