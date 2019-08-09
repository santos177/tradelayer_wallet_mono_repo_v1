var user = 'Ale'
var pass = '12345678'


var litecoin = require('litecoin');

var tl = require('./TradeLayerRPCAPI.js').tl

tl.init = function(user, pass, otherip, test){
  var host
  if(otherip == null){host = 'localhost'}else{host=otherip}
  var port
  if(test == false || test == null){port = 9332}else{port=19336}  
  var client = new litecoin.Client({
    host: host,
    port: port,
    user: user,
    pass: pass
    timeout:30000
    ssl:false
  })
  
  return client
}

var volume = 1000
var priceFix = 1 
var loops = 0
var contract ="ALL F19"
var contractid = 5
var ecosystem = 1

function tradeBot(cb){
        setTimeout(function(){
            loops +=1
            var buyorsell = if(Math.rand()>=0.5){buyorsell=1}else{buyorsell=2}
            var address
            var newPrice = priceFix*(Math.rand()*0.25)
            if(loops%2==0){address="mgk68VJAJCP7sHChaPtAag7pbsZ7veQ4Pz"}else{address="midDKtlwDLDgXa4oUGfRrFJ1Pzc834GxVA"}
            var params = {address:address,tradetype:buyorsell,price:newPrice,quantity:volume,contractcode:contract}
            tl.sendContractTrade(params,function(data){
            	console.log(data)
            })
            if(loops%50==0){tl.cancelAllContractsByAddress(address,1,5,function(data){
            	console.log(data)
            })}
            tradeBot()
        }, 20000);
}

tradeBot()