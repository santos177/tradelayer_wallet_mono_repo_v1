var user = 'Ale'
var pass = '12345678'
var litecoin = require('litecoin');

var tl = require('./TradeLayerRPCAPI.js').tl


var volume = 1000
var priceFix = 1 
var loops = 0
var contract ="dzgltc"
var contractid = 9
var ecosystem = 1

function tradeBot(cb){
    
        setTimeout(function(){
            loops +=1
            var buyorsell =  Math.random()>=0.5 ? 1 : 2
            var newPrice = priceFix
            var address = loops%2==0 ? "QMjCWx6G85V89PYcb3msyyQvbp2RxCprEy" : "QMjCWx6G85V89PYcb3msyyQvbp2RxCprEy"
            var params = {address:address,tradetype:buyorsell,price:newPrice,quantity:volume,contractcode:contract, leverage: 2}
            tl.sendContractTrade(params,function(data, err){
            	console.log(data,err)
            })
            if(loops%50==0){tl.cancelAllContractsByAddress(address,1,5,function(data){
            	console.log(data)
            })}
            tradeBot()
        }, 20000);
}

tradeBot()