'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const baseUrl = "http://localhost";
const basePort = 3002;
const socketPort = 75

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: `"${baseUrl}:${basePort}/api"`,
  SOCKET_URL:`"${baseUrl}:${socketPort}"`
})
