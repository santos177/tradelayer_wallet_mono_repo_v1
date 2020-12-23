var tl = require('./TradeLayerRPCAPI').tl
var loops = 0

var property1 = 4 // add property 1
var property2 = 5 // add property 2
var address1 = "QNQGyQs75G2wrdkVhQAVztoU9Ma6EQe1a8" // add address 1
var address2 = "QbbqvDj2bJkeZAu4yWBuQejDd86bWHtbXh" // add address 2 
var deleteCount = 50

var intervalMs = 10000

function tradeBot(){
    setInterval(function(){
            loops +=1
            var amount1 =  Math.random()>=0.5 ? 0.01 : 0.025
            var amount2 = parseFloat((Math.random()*0.02).toFixed(4))
            var address = loops%2==0 ? address1 : address2
            var params = {
                address,
                id1: property1,
                amount1: amount1,
                id2: property2,
                amount2: amount2,
            };
            console.log(`loop number: ${loops}`);
            tl.sendTrade(address, property1,amount1,property2,amount2 ,function(data, err){
                if(err) {
                    console.log("There is an error with Trade!!!\n", params, err)
                } else {
                    console.log("Successful Trade: \n", data)
                }

            })
            if(loops%deleteCount==0){
                tl.sendCancelAllTrades(address1, function(data, err){
                if (err) {
                    console.log("There is an error with trade cancelation !!!\n", err)
                } else {
                    console.log("Successful Trade Cancelation: \n", data)
                }
            })
            tl.sendCancelAllTrades(address2, function(data, err){
                if (err) {
                    console.log("There is an error with trade cancelation !!!\n", err)
                } else {
                    console.log("Successful Trade Cancelation: \n", data)
                }
            })
        }
        }, intervalMs);
}

tradeBot()
