const fs = require('fs')
const readline = require('readline')
const identityDatabase = require(`../config/identity-database`)
const modelDatabase = require(`../config/models-database`)


//Models
const IdentityUser = require(`../models/identity.user.model`)
const ModelUser = require('../models/user.model')
const Event = require("../models/event.model")
const Tickets = require("../models/ticket.model")


module.exports = {
  seeddatabase() {

    const modelUser = ModelUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No ModelUsers found in database, seeding new ModelUsers`);

        //Read every line from the SQL script and execute each command 
        const userStream = readline.createInterface({ input: fs.createReadStream('./scripts/sd_users.sql') })
        userStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding ModelUsers! \n");
        })
      }
    })


    const identityUser = IdentityUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No IdentityUsers found in database, seeding new IdentityUsers`);

        //Read every line from the SQL script and execute each command 
        const identityUserStream = readline.createInterface({ input: fs.createReadStream('./scripts/sd_identity_users.sql') })
        identityUserStream.on('line', (line) => identityDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding IdentityUsers! \n");
        })
      }
    })


    const eventUser = Event.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No Events found in database, seeding new Events`);

        //Read every line from the SQL script and execute each command 
        const eventStream = readline.createInterface({ input: fs.createReadStream('./scripts/sd_events.sql') })
        eventStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding Events! \n");

          Tickets.destroy({where: {}}).then(res => {
            console.log(`Seeding new Tickets`);

            const ticketStream = readline.createInterface({ input: fs.createReadStream('./scripts/sd_tickets.sql') })
            ticketStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
              console.log("Done seeding Tickets! \n");
            })
          })
        })
      }
    })

    return new Promise((resolve, reject) => {
      Promise.all([
        modelUser,
        identityUser,
        eventUser
      ]).then(() => {
        resolve()
      })
    })
  }
}