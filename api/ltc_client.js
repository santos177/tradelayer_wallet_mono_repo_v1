var litecoin = require('litecoin');
const config = require('./config')

module.exports = new litecoin.Client({
    host: 'localhost',
    port: config.TLPORT,
    user: "pepejandro",
    pass: "pepecash",
    ssl: false/* true, */
  });