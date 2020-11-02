// account.service
// does the api calls to backend for wallet
import {axiosInstance} from '../api'

// export contracts service
export const contractsService = {
  getEquity,
  postBuyContracts,
  postSellContracts,
  postALLPrice,
  postCancelTrades,
  getPositions,
  getFullPositions,
  getLastContractId,
  postTransactionsbyAddress,
  postActiveTradesbyAddress,
  postCancelSingleActiveTrade,
  getTokenAmount,
  getTokenInfo,
  sendtrade,
}

// getEquity
// pass the address, contractIDALL, contractID (which you want reserve balance of)
// returns JSONobject of balance

function sendtrade(data) {
  if( !data.propsIdForSale || !data.amountforsale || !data.propsIdDesired || !data.amountdesired || !data.address) {
    console.log("Error with body of the trade post request")
    return;
  }
  return new Promise(async (resolve,reject) => {
    try {
      const result =  axiosInstance.get('/sendtade', { params: data })
      resolve(result);
    } catch (err) {
      reject(err);
    }
  })
}

function getTokenInfo(token) {
  return new Promise(async (resolve,reject) => {
    try {
      const params = {id: token}
      const result = await axiosInstance.get('/properties/getproperty/' + token, { params })
      resolve(result.data);
    } catch (err) {
      reject(err);
    }
  })
}
function getTokenAmount(address, token) {
  return new Promise(async (resolve,reject) => {
    try {
      const params = {address, propertyID: token}
      const result = await axiosInstance.get('/balances/byid', { params })
      resolve(result.data);
    } catch (err) {
      reject(err);
    }
  })
}

function getEquity (address, contractID, contractIDALL) {
  return axiosInstance.get('/getEquity', {
    params: {
      'address': address,
      'contractID': contractID,
      'contractIDALL': contractIDALL }
  })
}

// postTransactionsbyAddress
// inputs: address and contractID
// output:array of  JSON object of transactions on blockchain involving that address
function postTransactionsbyAddress (contractID, address) {
  console.log('ths address we pass in postTransbyaddress ', address)
  return axiosInstance.post('/postTransactionsbyAddress', {
    address: address,
    contractID: contractID
  })
}

// postActiveTradesbyAddress
// inputs: contractID and address
// output: array of JSON object of open trades by that address
function postActiveTradesbyAddress (contractID, address) {
  return axiosInstance.post('/postActiveTradesbyAddress', {
    address: address,
    contractID: contractID
  })
}

// postcancelSingleActiveTrade(data.txid, data.block, data.idx)
function postCancelSingleActiveTrade (senderAddress, block, idx) {
  return axiosInstance.post('/postCancelSingleActiveTrade', {
    senderAddress: senderAddress,
    block: block,
    idx: idx
  })
}

// postBuyContracts
// inputs: qty, price, contractID, address
// action (always 1 for Buy)
// outputs : transaction id from trade
function postBuyContracts (qty, price, contractID, address, leverage) {
  // console.log(' in post Buy Contracts service sent to ', axiosInstance)
  return axiosInstance.post('/postTradeContracts', {
    qty: qty,
    price: price,
    action: 1,
    contractID: contractID,
    address: address,
    leverage: leverage
  })
}

// postSellContracts
// inputs: qty, price, action (always 2 for Sell), contractID, address
// outputs : transaction id from trade
function postSellContracts (qty, price, contractID, address, leverage) {
  // in account post Login
  return axiosInstance.post('/postTradeContracts', {
    qty: qty,
    price: price,
    action: 2,
    contractID: contractID,
    address: address,
    leverage: leverage
  })
}

// cancel Trades
// inputs: contractID , address
function postCancelTrades (contractID, address) {
  return axiosInstance.post('/cancelTrades', {
    contractID: contractID,
    address: address
  })
}

// get ALL price
function postALLPrice () {
  return axiosInstance.post('/getALLPrice')
}
// getPositions -> deprecated
function getPositions (account, contractID) {
  // change this to getPositions later
  return axiosInstance.post('/postPosition/', {
    account: account,
    contractID: contractID
  })
}

// getFullPositions
function getFullPositions (account, contractID) {
  // console.log(' contractID in getFUllPositions contract service ', contractID)
  return axiosInstance.post('/postFullPositions', {
    account: account,
    contractID: contractID
  })
}

function getLastContractId () {
  return axiosInstance.get('/getLastProperty')
}
