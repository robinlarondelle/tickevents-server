const fs = require('fs')
const readline = require('readline')
const identityDatabase = require(`../config/identity-database`)
const modelDatabase = require(`../config/models-database`)


//Models
const IdentityUser = require(`../models/identity.user.model`)
const ModelUser = require('../models/user.model')
const Event = require("../models/event.model")
const Ticket = require("../models/ticket.model")


module.exports = {
  seeddatabase() {

    ModelUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No ModelUsers found in database, seeding new ModelUsers`);

        //Read every line from the SQL script and execute each command 
        const userStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_users.sql") })
        userStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding ModelUsers! \n");
        })
      }
    })


    IdentityUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No IdentityUsers found in database, seeding new IdentityUsers`);

        //Read every line from the SQL script and execute each command 
        const identityUserStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_identity_users.sql") })
        identityUserStream.on('line', (line) => identityDatabase.query(`${line}`)).once("close", () => {
          console.log("Done seeding IdentityUsers! \n");
        })
      }
    })


    Event.findAll().then(events => {
      if (events.length === 0) {
        console.log(`No Events found in database, seeding new Events`);

        //Read every line from the SQL script and execute each command 
        const eventStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_events.sql") })
        eventStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          Ticket.destroy({ where: {} }).then(() => {
            Event.findAll().then(data => {

              for (var i = 0; i < data.length; i++) {                
                for (var j = 0; j < data[i].Capacity; j++) {
                  Ticket.create({
                    EventID: data[i].EventID,
                    Price: data[i].PricePerTicket
                  })
                }
              }

              console.log(`Done seeding Events and Tickets`);
            })
          })
        })
      }
    })
  }
}