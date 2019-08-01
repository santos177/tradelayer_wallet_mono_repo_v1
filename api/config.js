// config.js
require('dotenv').config() // this loads variables from .env filter

const config = {
  SESSION_SECRET: process.env.SESSION_SECRET,
  DBHOST: process.env.DBHOST,
  DBPORT: process.env.DBPORT,
  DBUSER: process.env.DBUSER,
  DBPASSWORD: process.env.DBPASSWORD,
  DBNAME: process.env.DBNAME,
  AESKEY: process.env.AESKEY,
  AESIV: process.env.AESIV,
  JWT_SECRET: process.env.JWT_SECRET,
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  TLPATH: process.env.TLPATH,
  TLDATADIR: process.env.TLDATADIR,
  LOGGER: process.env.LOGGER,
  TLPORT: process.env.TLPORT

}

module.exports = config
