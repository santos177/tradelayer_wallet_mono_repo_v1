import {axiosInstance} from '../api'

// export account service
export const pcurrencyService = {
  createPegCurrency,
  getBalancePegged,
  sendPeggedCurrency,
  redeemPeggedCurrency,
  maxPeggedCurrency,
  getBalanceALL
}

function createPegCurrency (name, quantity, address, contractID) {
  return axiosInstance.post('/createPeg', { 'name': name, 'qty': quantity, 'address': address, 'contractID': contractID })
}

/* var fromaddress = req.body.fromaddress;
    var toaddress = req.body.toaddress;
    var contractID = req.body.contractID;
    var amount = req.body.amount; */
function sendPeggedCurrency (toAddress, fromAddress, contractID, amount) {
  return axiosInstance.post('/sendPegged', {
    'fromAddress': fromAddress,
    'toAddress': toAddress,
    'contractID': contractID,
    'amount': amount
  })
}

/* var redeemaddress = req.body.redeemaddress;
var propertyID = req.body.propertyID;
var amount = req.body.amount;
var contractID = req.body.contractID; */
function redeemPeggedCurrency (redeemAddress, name, amount, contractID) {
  return axiosInstance.post('/redeemPegged', {
    'redeemaddress': redeemAddress,
    'name': name,
    'amount': amount,
    'contractID': contractID
  })
}

// 1) fromaddress (string, required) the address to send from\n"
// 2) contractID (number, required) contract ID which is collaterilized in ALL
function maxPeggedCurrency (fromAddress, contractID) {
  return axiosInstance.post('/maxPegged', {
    'fromAddress': fromAddress,
    'contractID': contractID
  })
}

function getBalancePegged (address, contractID) {
  //
  // console.log('this is the address we are passing it ', address)
  return axiosInstance.get('/balances', {
    params: {
      'address': address,
      'contractID': contractID }
  })
}

function getBalanceALL (address, contractID) {
  //
  // console.log('this is the address we are passing it ', address)
  return axiosInstance.get('/getBalanceALL', {
    params: {
      'address': address,
      'contractID': contractID }
  })
}
