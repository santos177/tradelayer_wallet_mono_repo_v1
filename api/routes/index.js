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
const marketDataAPI = require('./marketdata')

const configureRoutes = app => {
  // app.use gives the prefix to all routes; all routes should probably use this syntax eventually
  app.use('/api/balances', balanceRouter)
  app.use('/api/properties', propertyRouter)
  app.use('/api/orderbooks', orderbookRouter)
  app.use('/api/txn', txnRouter)
  app.use('/api/positions', positionRouter)
  app.use('/api/dcurrency', dcurrencyApi)
  app.use('/api/marketdata', marketDataRouter)
  balanceApi(app)
  dcurrencyApi(app)
  priceApi(app)
  tradeApi(app)
  userApi(app)
  marketDataAPI(app)
}

module.exports = configureRoutes
