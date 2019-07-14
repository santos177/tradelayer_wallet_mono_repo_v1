const { Client } = require('pg')
const config = require('./config')

//connect to db
const client = new Client({
	host: config.DBHOST,
	database: config.DBNAME,
	port: config.DBPORT,
	user: config.DBUSER,
	password: config.DBPASSWORD
})

client.connect((err) => {
 if (err) {
  console.error('connection error', err.stack)
 } else {
  console.log('connected')
 }
})


module.exports = {
  dbconnect: client
}
