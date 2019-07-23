var litecoin = require('litecoin');

module.exports = new litecoin.Client({
    host: 'localhost',
    port: 9332,
    user: "pepejandro",
    pass: "pepecash",
    ssl: false/* true, */
  });