const mysql = require('mysql')

//Creating a MySQL pool to serve a connection to each request
var pool  = mysql.createPool({
  connectionLimit : 10,
  database        : process.env.DB_IDENTITY,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
})
const reconnectTimeout = 2000

// Establish a connection to MySQL
pool.getConnection((error, connection) => {
  if (error) {
      console.error('Error connecting to database ' + process.env.DB + ' on ' + process.env.DB_HOST + ': ' + error.message);
      connection.end()
      setTimeout(handleDisconnect, reconnectTimeout)
  } else {
      console.log('Connected to database ' + process.env.DB + ' on ' + process.env.DB_HOST + ', state = ' + connection.state);

      // done with the connection.
      connection.release()
  }
})

module.exports = pool;
