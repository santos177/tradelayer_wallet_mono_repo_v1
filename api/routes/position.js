var { dbconnect } = require('../dbconnect')
const config = require('../config')
var path= config.TLPATH
var datadir = config.TLDATADIR

const positionApi = ({omniClient, ...app}) => {
  //postFullPositions
  app.post('/api/postFullPositions', (req, res) => {
    var account = req.body.account
    // console.log('this is the account in full positions ', account)
    var contractID = req.body.contractID.toString()
    // console.log('this is the contractID in postFUllPositions ', contractID)
    // console.log('contractID in postFullPositions ', contractID)
    var address = ""
    // TODO: only for demo purposes are we using address directly - this 'account' is actually 'address' from front end
    address = req.body.account
    address = address.toString()
    // helpers.getNewAddress(account)
    //   .then(function whenOk(address) { console.log('this is the resp from new address rpc' , address)})
    //   .catch((err) => { console.log ('this is the error in new address rpc ', err)})

    // var getAddressPromise = new Promise((resolve, reject) => {
      // ./litecoin-cli -datadir=$DATADIR getaccountaddress  <name of account>
      // how will we manage multiple addresses with difference balances ? ->  currently only one address
      // var addresscommand = path+"/litecoin-cli -datadir=" + datadir + " getaccountaddress " + account

    //   omniClient.cmd('getaccountaddress', account, function(err, accountResp, resHeaders){
    //     if (err === null){
    //       resolve(accountResp)
    //     } else {
    //       console.log('error in address command ', err)
    //       reject(err)
    //     }
    //   }) // end of address command
    // })  // end of promise callback
    // .then((data) => {
      // console.log("data from get address promise", data)
      // TODO: put this back after demo
      // address = data
      // execute getfullposition rpc
      // TODO: change this back to using address derived from account
      // var fullPositionRPC = path+"/litecoin-cli -datadir=" + datadir + " tl_getfullposition \"" + address + "\" " + contractID
      omniClient.cmd('tl_getfullposition',address, contractID, function whenOK(err, fullPosition, resHeaders) {
      //omniClient.cmd('tl_getfullposition', "mkfm54aYiZHXPba2ZLzyRSYZWqhmoiC3J5", "5", function(err, fullPosition, resHeaders){
      // exec(fullPositionRPC, (errorFP, stdoutFP, stderrFP) => {
        if(err === null) {
          var fullPositions = JSON.stringify(fullPosition)
          // console.log('full position response ', fullPositions)
          res.send(fullPositions)
        } // end of if errorFP
        else {
          console.log('error in get fullPositions', err)
          res.send(err)
        } // end of else errorFP
      }) //end of exec fullPositionRPC
    // }) // end of then for getAddressPromise
    // .catch((err) => {
    //   console.log('error in getAdddressPromise', err)
    //   res.send(err)
    // }) // catch for getAddressPromise
  }) // end of postFullPositions

  return app
}

module.exports = positionApi
