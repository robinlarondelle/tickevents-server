const { range } = require("rxjs")
const fs = require('fs')
const readline = require('readline')
const identityDatabase = require(`../config/identity-database`)
const modelDatabase = require(`../config/models-database`)


//Models
const IdentityUser = require(`../models/identity.user.model`)
const ModelUser = require('../models/user.model')
const Event = require("../models/event.model")
const Ticket = require("../models/ticket.model")
const TicketTypes = require("../models/ticket-type.model")


module.exports = {
  seeddatabase() {
    Promise.all([
      seedModelUsers(),
      seedIdentityUsers(),
      seedEvents()
    ]).then(() => {
      seedTicketTypes().then(() => {
        seedTickets()
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }
}


function seedIdentityUsers() {
  return new Promise((resolve, reject) => {

    IdentityUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No IdentityUsers found in database, seeding new IdentityUsers`);

        //Read every line from the SQL script and execute each command 
        const identityUserStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_identity_users.sql") })
        identityUserStream.on('line', (line) => identityDatabase.query(`${line}`)).once("close", () => {
          resolve(console.log("Done seeding IdentityUsers"))
        })
      }
    })

  })
}


function seedModelUsers() {
  return new Promise((resolve, reject) => {

    ModelUser.findAll().then(data => {
      if (data.length === 0) {
        console.log(`No ModelUsers found in database, seeding new ModelUsers`);

        //Read every line from the SQL script and execute each command 
        const userStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_users.sql") })
        userStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          resolve(console.log("Done seeding ModelUsers"))
        })
      }
    })

  })
}


function seedEvents() {
  return new Promise((resolve, reject) => {
    Event.findAll().then(events => {
      if (events.length === 0) {
        console.log(`No Events found in database, seeding new Events`);

        //Read every line from the SQL script and execute each command 
        const eventStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_events.sql") })
        eventStream.on('line', (line) => modelDatabase.query(`${line}`)).once("close", () => {
          resolve(console.log("Done seeding Events."))
        })
      }
    })
  })
}


function seedTicketTypes() {
  return new Promise((resolve, reject) => {
    TicketTypes.findAll().then(types => {
      if (types.length === 0) {
        console.log("No TicketTypes found. Seeding new TicketTypes")

        const tickettypesStream = readline.createInterface({ input: fs.createReadStream("src\\scripts\\sd_tickettypes.sql") })
        tickettypesStream.on('line', line => modelDatabase.query(`${line}`)).once("close", () => {
          resolve(console.log("Done seeding TicketTypes."))
        })
      }
    })
  })
}


function seedTickets() {
  return new Promise((resolve, reject) => {
    TicketTypes.findAll().then(types => {
      if (types !== 0) {
        
        types.map(type => {

          Ticket.findAll({
            where: {
              TicketTypeID: type.TicketTypeID
            }
          }).then(tickets => {
            if (tickets.length === 0) {
              range(0, type.Availability).subscribe(x => {
                if (generateRandom(1, 10) === 1) { // 1 in 10 tickets will be sold
                  Ticket.create({
                    TicketTypeID: type.TicketTypeID,
                    BoughtBy: generateRandom(1, 6),
                    PaymentReceived: true
                  })
                } else {
                  Ticket.create({
                    TicketTypeID: type.TicketTypeID
                  })
                }
              })
            }
          })
        })
      } else (reject(console.log("No TicketTypes found to create Tickets for")))
    })
  })
}

function generateRandom(min, max) {
  if (!!min && !!max) {
    return Math.floor(Math.random() * (+max - +min)) + +min;
  } else return Math.floor(Math.random() * 10)
}