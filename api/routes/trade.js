var { dbconnect } = require('../dbconnect')
const config = require('../config')
var exec = require('child_process').exec;
var path= config.TLPATH
var datadir = config.TLDATADIR

const tradeApi = ({omniClient, ...app}) => {

  app.get('/api/getFees', function(req, res){
    const { contractId } = req.query
    omniClient.cmd('tl_getfees', contractId, function whenOK(err, fees){
      if(err){
        res.send(err.toString())
      } else {
        res.send(fees)
      }
    })
      
  })

  app.post('/api/bot', function(req, res){

    console.log("PARAM :"+req.body)

    var obj = {};
    var qty = req.body.qty;
    var price = req.body.price;
    var action = req.body.action;
    var contractID = req.body.contractID;
    var address = req.body.address;
    var leverage = req.body.leverage;
    var command = "/root/BlockPo-to-Tradelayer/src/litecoin-cli -datadir=/root/.litecoin tl_tradecontract \""+ address +"\" \""+ contractID +"\" "+ qty +" "+ price +" "+ action;  //req.params.command;
    console.log("COMMAND "+ command)

    omniClient.cmd('tl_tradecontract', address.toString(), contractID.toString(), qty.toString(), price.toString(), action, leverage.toString(), function whenOK(err, trade, resHeaders){
        if(err === null) {
            console.log("La transaccion "+ trade)
                                  // req.body.trxid = trade;
            res.send('ok');

        } else {
            console.log('something went wrong in the bot ', err)
            res.send(err)
        }
    });
});

  app.post('/api/postActiveTradesbyAddress', (req, res) => {
    
    var address = req.body.address.toString()
    var contractID = req.body.contractID.toString()+'xxxx'

    omniClient.cmd('tl_getcontract_orderbook', contractID, 1, function whenOK(err, buytrades, resHeaders) {
      if(err==null) {
        var filteredbuyTrades = buytrades.filter((trade)=>{
          return trade.address == address
        })
        var buyText = JSON.stringify(filteredbuyTrades, null, "\t")
        omniClient.cmd('tl_getcontract_orderbook', contractID, 2, function whenOK(err, selltrades, resHeaders) {
          if(err==null){
            // filter sells by address
            filteredsellTrades = selltrades.filter((trade)=>{
              return trade.address == address
            })
            var sellText = JSON.stringify(filteredsellTrades, null, "\t")
            var jsonTxt = "["+ buyText +","+ sellText +"]";
            var jsonObj = JSON.parse(jsonTxt);
            
            res.send(jsonObj)
          } else{
            console.log('something went wrong in sells tade by address ', err)
            res.send(err)
          }
        }) // end of get contract orderbook for sells
      } else {
        console.log('something went wrong with buy postActiceTradesbyAddress ', err)
        res.send(err)
      } // end of buys
    })
  }) // end of postActiveTradesbyAddress

  app.post('/api/postTradeContracts', function(req, res){
  			var obj = {};
  			var qty = req.body.qty;
  			var price = req.body.price;
  			var action = req.body.action;
  			var contractID = req.body.contractID;
  			var address = req.body.address;
        var leverage = req.body.leverage;

        console.log('post trade contracts values ', qty + ' ' + price + ' ' )
        console.log('post trade contracts values ', action + ' ' + contractID + ' ' )
        console.log('post trade contracts values ', address  )

  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_tradecontract "+ address +" \""+ contractID +"\" "+ qty +" "+ price +" "+ action + " " + leverage;  //req.params.command;

        console.log('command send to tradecontract ', command)

  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
  					//console.log("La TRX "+ stdout)
            // stdout = JSON.stringify(stdout.trim(), null, "\t")
            // var txid = {"txid": stdout}
            // var txJSON = JSON.stringify(txid)

            console.log('result of transaction', stdout)
            // var jsonTXT = "[" + stdout + "]"
            // jsonTXT = JSON.parse(jsonTXT)
            // txJSON = JSON.parse(txJSON)
            // console.log('json txid', txJSON)
            req.body.trxid = stdout.trim()
            //console.log('json txid', jsonTXT)
  					res.send(req.body);

  				} else {
            console.log("error in trade contracts", stderr)
            res.send(error)
          }
  			});
  });

  // in progress
  app.post('/api/getTradeHistory', function(req, res){

  			var address = req.body.address;
  			var contractID = req.body.contractID;

        console.log('address of positions', address)
        console.log('contractid of positions', contractID)

  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_gettradehistory "+ contractID;  //req.params.command;

  			console.log("El comando "+ command);
  			//var command2 = path+"/litecoin-cli -datadir="+ datadir +" --testnet generate 1";
  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
            console.log('trade history output from getTradeHistory', stdout)
  					var TradeHistory = JSON.parse(stdout)
            res.send(TradeHistory)

  				} else {
            res.send(error)
          }
  			});
  });

  app.post('/api/postTransactionsbyAddress', (req, res) => {
    var address = req.body.address
    address = address.toString()
    console.log('this is the address sent to transctions by address ', address)
    var contractID = req.body.contractID

    omniClient.cmd('tl_listtransactions',address, function whenOK(err, transactions, resHeaders) {
      // "tl_listtransactions ( \"address\" count skip startblock endblock )\n"
      //           "\nList wallet transactions, optionally filtered by an address and block boundaries.\n"
      //           "\nArguments:\n"
      //           "1. address              (string, optional) address filter (default: \"*\")\n"
      //           "2. count                (number, optional) show at most n transactions (default: 10)\n"
      //           "3. skip                 (number, optional) skip the first n transactions (default: 0)\n"
      //           "4. startblock           (number, optional) first block to begin the search (default: 0)\n"
      //           "5. endblock             (number, optional) last block to include in the search (default: 9999999)\n"
      if(err === null) {
        var transactionsJSON = JSON.stringify(transactions)
        console.log('transactions response ', transactions)
        res.send(transactionsJSON)
      } // end of if errorFP
      else {
        console.log('something went wrong in the postTransactionsbyAddress')
        res.send(err)
      }
    })
  })

  app.post('/api/postCancelSingleActiveTrade', (req, res) => {
    var fromAddress = req.body.senderAddress
    var block = req.body.block
    var idx = req.body.idx

    console.log('this is address ', fromAddress.toString())
    console.log('this is block ', block)
    console.log('this is idx ', idx)

    omniClient.cmd('tl_cancelorderbyblock', fromAddress.toString(), block, idx, function whenOK(err, cancelResp, respHeaders) {
      if(err === null){
        console.log('cancel success ', cancelResp)
        res.send(cancelResp)
      } else {
        console.log('cancel failure ', err)
        res.send(err)
      }
    })
  })

  // cancel tradees
  app.post('/api/cancelTrades', function(req, res){
  			var contractID = req.body.contractID;
  			var address = req.body.address;

  			var command = path+"/litecoin-cli -datadir="+ datadir +" tl_cancelallcontractsbyaddress "+ address +" 1 "+ contractID;  //req.params.command;
  			console.log("El comando "+ command);
  			exec(command, function (error, stdout, stderr) {
  				if (error === null) {
            console.log('cancel trades output', stdout)
  					res.send(req.body)
  				} else {
            console.log('error in cancel trades ', stderr)
            res.send(stderr)
          }
  			});
  });

  app.post('/api/recentTrades', function(req, res){
  			var contractID = req.body.contractID.toString()
        omniClient.cmd('tl_gettradehistory', contractID, function whenOK(err, tradeResp, resHeaders) {
  				if (err === null) {
  					res.send(tradeResp);
  				} else {
            console.log('error in recent trades:', err.toString())
            res.send({error: err.toString()})
          }
  			})
  })

app.post('/api/recentTradesbyAddress', function(req, res){

      var contractID = req.body.contractID.toString()
      var address = req.body.address.toString()
      omniClient.cmd('tl_gettradehistory', contractID, function whenOK(err, tradeResp, resHeaders) {
        if (err === null) {
          var objTrades =  tradeResp
          var arrayTrades = Object.values(objTrades)
          var filteredTrades = arrayTrades.filter(function(trade) {
            return (trade.maker_address == address || trade.taker_address == address)
          })

          res.send(filteredTrades);
        } else {
          console.log('error in recent trades by address', err.toString())
          res.send({error: err})
        }
      })
})

app.post('/api/sendtade', (req,res) => {
  const data = req.body;
  console.log(data)
})

return app
}

module.exports = tradeApi
