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
const VerificationTokens = require("../models/verificationtoken.model")


module.exports = {

  seeddatabase() {
    clearDatabase().then(() => {
      Promise.all([
        seedModelUsers(),
        seedIdentityUsers()
      ]).then(() => {
        seedEvents().then(() => {
          seedTicketTypes().then(() => {
            seedTickets().then(() => {
              console.log("done")
            })
          })
        })
      })
    })
  }
}


function clearDatabase() {
  return new Promise((resolve, reject) => {

    Ticket.destroy({where: {}}).then(() => {
      TicketTypes.destroy({where: {}}).then(() => {
        Event.destroy({where: {}}).then(() => {
          ModelUser.destroy({where: {}}).then(() => {
            VerificationTokens.destroy({where: {}}).then(() => {
              IdentityUser.destroy({where: {}}).then(() => {
                console.log("Dumped entire Database");
                resolve()
              })
            })
          })
        })
      })
    })
  })
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
              ticketTypeID: type.ticketTypeID
            }
          }).then(tickets => {
            if (tickets.length === 0) {
              range(0, type.availability).subscribe(x => {
                if (generateRandom(1, 11) === 1) { // 1 in 10 tickets will be sold
                  Ticket.create({
                    ticketTypeID: type.ticketTypeID,
                    eventID: generateRandom(1, 11),
                    boughtBy: generateRandom(1, 11),
                    paymentReceived: true
                  })
                } else {
                  Ticket.create({
                    ticketTypeID: type.ticketTypeID,
                    eventID: generateRandom(1, 11),
                  })
                }
              })
            }
          })
        })

        resolve()

      } else (reject(console.log("No TicketTypes found to create Tickets for")))
    })
  })
}

function generateRandom(min, max) {
  if (!!min && !!max) {
    return Math.floor(Math.random() * (+max - +min)) + +min;
  } else return Math.floor(Math.random() * 10)
}