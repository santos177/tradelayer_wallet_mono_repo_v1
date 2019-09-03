const {balanceRouter, balanceApi} = require('./balance')
const propertyRouter = require('./property')
const orderbookRouter= require('./orderbook')
const txnRouter = require('./txn')
const positionRouter = require('./position')
const {dcurrencyApi, dcurrencyRouter} = require('./dcurrency')
const orderbookApi =require('./orderbook')
const priceApi = require('./price')
const tradeApi = require('./trade')
const userApi = require('./user')

const configureRoutes = app => {
  app.use('/api/balances', balanceRouter)
  app.use('/api/properties', propertyRouter)
  app.use('/api/orderbooks', orderbookRouter)
  app.use('/api/txn', txnRouter)
  app.use('/api', positionRouter)
  app.use('/api/dcurrency', dcurrencyApi)
  balanceApi(app)
  dcurrencyApi(app)
  priceApi(app)
  tradeApi(app)
  userApi(app)
}

module.exports = configureRoutes
