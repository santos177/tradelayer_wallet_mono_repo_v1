'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const baseUrl = "http://192.155.93.12";  

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: `"${baseUrl}:76/api"`,
  SOCKET_URL:`"${baseUrl}:76"`
})
