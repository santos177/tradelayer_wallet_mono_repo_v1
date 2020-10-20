import {axiosInstance} from '../api'

// export account service
export const orderbookService = {
  getOrderBook,
  getRecentTrades,
  postRecentTradesbyAddress,
  getPairOrderBook
}

// postLogin
// calls postWalletLogin api
// inputs: uuid, nonce, publicKey, mfatoken
// outputs: wallet and asq question
function getOrderBook (contractID) {
  // in account post Login
  // console.log('this is the contractID we are passing to orderbook rest call ', contractID)
  return axiosInstance.get('/orderbooks', {'contractID': contractID})
}
function getPairOrderBook (pairObj) {
  return axiosInstance.get('/orderbooks/pair', { params : pairObj })
}

function getRecentTrades (contractID) {
  // in account post Login
  return axiosInstance.post('/recentTrades', {'contractID': contractID})
}

function postRecentTradesbyAddress (contractID, address) {
  return axiosInstance.post('/recentTradesbyAddress',
    {'contractID': contractID,
      'address': address})
}
