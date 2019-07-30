var { dbconnect } = require('../dbconnect')
const config = require('../config')
var path= config.TLPATH
var datadir = config.TLDATADIR
var exec = require('child_process').exec;
const express = require('express')
const balanceRouter = express.Router()
const {Address, Balance} = require('../models/index.js') 

balanceRouter.get('/tl_getTX/',  (req, res)=> {
  const txnId = req.query.txnId;
  req.omniClient.getTransaction(txnId, (data, err)=>{
    if(err){
      res.json(err.Error)
    }
    res.json(data)
  })
})

balanceRouter.get('/tl_getBalances/',  async  (req, res)=> {
  // todo: optional prop arg
  const {address, propId} = req.query;
  if (address){
    const result = await Balance.findAll({
      include: [
        {
          model: Address,
          where: {
            address
          }
        }
      ]
    });

    res.json(result);
  } else {
      req.omniClient.cmd("listreceivedbyaddress", 0, true, async function( err, addresses,resHeaders) {
        const result = await Balance.findAll({
          include: [
            {
              model: Address,
              where: {
                address: addresses.map( (obj)=> obj.address)
              }
            }
          ]
        });
        res.json(result)
      })
    }



  })




const balanceApi = ({omniClient, ...app}) => {




  app.get('/api/getBalancePegged', function(req, res){
      var address = req.query.address
      var contractID = req.query.contractID
      console.log(' this is the address in getBalancePegged ', address.toString())

  		var balances = []

  		var balanceCommand = path+"/litecoin-cli -datadir="+ datadir +" tl_getbalance "+address.toString()+" "+ contractID;
      console.log('get balance pegged command line ', balanceCommand)
  		var options = { env : process.env }

      exec(balanceCommand, options, function (error, stdout2, stderr) {
  				if (error === null) {
  					var balance = JSON.parse(stdout2).balance
  					// console.log('balance is ' + balance )
  					balances.push({'balance' : balance })
  					// console.log('balances are' + balances)
  					res.send(balances);

  				}
  				else {
            console.log('balance not greater than 0', stderr)
  					res.send(stderr)
  		  	}
  	})
  })

  app.get('/api/getBalanceALL', function(req, res){
      var address = req.query.address.toString();
      var contractID = req.query.contractID;

      console.log(' this is the address in getBalancePegged ', address.toString())
  	  var sellObj = "";
  	  var buyObj = "";
  		var balances = [];

  		var balanceCommand = path+"/litecoin-cli -datadir="+ datadir +" tl_getbalance "+address.toString()+" "+ parseInt(contractID);

      // console.log('get balance command line ', balanceCommand)
  	  var options = { env : process.env }

    	exec(balanceCommand, options, function (error, stdout2, stderr) {
  				if (error === null) {
  					var name = 'ALL';
  					// console.log('name of coin', name)
  					var balance = JSON.parse(stdout2).balance
  					// console.log('balance is ' + balance )

            if(Number(balance) > 0){
  						console.log('inside parse of balance as number')
  						balances.push({'name' : name, 'balance' : balance })
  						console.log('balances are' + balances)
  							if (balances.length > 0){
                  //after getting all balance, then get Vesting token balance
                  omniClient.cmd('tl_getbalance', address, 3, function whenOK(err, vesting, resHeaders){
                    if(err === null){
                      console.log('this is vesting balance ', vesting.balance)
                      balances.push({'name' : 'Vesting', 'balance' : vesting.balance})
                      console.log('this is balance in vesting ', balances  )
                      omniClient.cmd('tl_getbalance', address, 1, function whenOK(err, vested, resHeaders){
                        if(err === null){
                          console.log('this is vested ALL ', vested.balance)
                          balances.push({'name' : 'Vested ALL', 'balance' : vested.balance})
                          console.log('this is balance in vested all ', balances  )

                          res.send(balances);
                        } else {
                          console.log('something wnt wrong in calling balance of vested ALL ', err)
                          res.send(err)
                        }
                      })
                    } else {
                      console.log('something went wrong in vesting balance ', err)
                      res.send(err)
                    }
                  })
  							}
  							else {
  								res.send('problem parsing balance' + balances)
  							}
  					 }
  					 else {
  						 res.send('empty balances')
  						 console.log('balance not greater than 0')
  					}
  				} //end if balance command executes successfulluy
  				else {
  					res.send(stderr)
  						console.log('balance command error', stderr)
  				} //end balance command execution
  		});
  })

  app.get('/api/getEquity', function(req, res){
      var address = req.query.address.toString();
      var contractIDALL = req.query.contractIDALL;
      var contractID = req.query.contractID;
      // console.log(' this is the address in Equity ', address.toString())
      var sellObj = "";
      var buyObj = "";
      var balances = [];
      var balance = 0.0
      var available = 0.0
      var balanceCommand = path+"/litecoin-cli -datadir="+ datadir +" tl_getbalance "+address.toString()+" "+ parseInt(contractIDALL);

      // console.log('get balance command line ', balanceCommand)
      var options = { env : process.env }

      exec(balanceCommand, options, function (error, stdout2, stderr) {
          if (error === null) {
            var name = 'ALL';
            // console.log('name of coin', name)
            balance = parseFloat(JSON.parse(stdout2).balance)
            balance += parseFloat(JSON.parse(stdout2).reserve)
            // console.log('balance is ' + balance )
            var myBalance = {
                         'balance': balance,
                         'available': available
                       }
            res.send(myBalance)
            // after getting all balance, then get Contract Reserve balance
            // omniClient.cmd('tl_getcontract_reserve', address, parseInt(contractIDALL), function whenOK(err, reserve, resHeaders){
            //         if (err === null) {
            //           console.log('this is reserve ', reserve)
            //           console.log('this is reserve balance ', reserve['contract reserve'])
            //           balance += parseFloat(reserve['contract reserve'])
            //           console.log('this is balance incl reserve ', balance  )
            //           var myBalance = {
            //             'balance': balance,
            //             'available': available
            //           }
            //           res.send(myBalance)
            //         } else {
            //           console.log('something went wrong in reserve balance ', err)
            //           res.send(err)
            //         }
            //      })
          } //end if balance command executes successfulluy
          else {
            console.log('balance command error', stderr)
            res.send(stderr)
          } //end of else error is null
    }) // balance command execution
  })

  return app
}

module.exports = {
  balanceApi,
  balanceRouter
}
