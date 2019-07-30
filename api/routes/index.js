const {balanceRouter, balanceApi} = require('./balance')
const propertyRouter = require('./property')
const orderbookRouter= require('./orderbook')

const dcurrencyApi = require('./dcurrency')
const orderbookApi =require('./orderbook')
const positionApi = require('./position')
const priceApi = require('./price')
const tradeApi = require('./trade')
const userApi = require('./user')

const configureRoutes = app => {
  // app.use('/api/balance', balanceRouter)
  // app.use('/api/properties', propertyRouter)
  app.use('/api/orderbooks', orderbookRouter)
  balanceApi(app)
  dcurrencyApi(app)
  positionApi(app)
  priceApi(app)
  tradeApi(app)
  userApi(app)
}

module.exports = configureRoutes
