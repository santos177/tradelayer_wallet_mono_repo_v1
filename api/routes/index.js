const balanceApi = require('./balance')
const dcurrencyApi = require('./dcurrency')
const orderbookApi =require('./orderbook')
const positionApi = require('./position')
const priceApi = require('./price')
const tradeApi = require('./trade')
const userApi = require('./user')

const configureRoutes = app => {
  balanceApi(app)
  dcurrencyApi(app)
  orderbookApi(app)
  positionApi(app)
  priceApi(app)
  tradeApi(app)
  userApi(app)
}

module.exports = configureRoutes
