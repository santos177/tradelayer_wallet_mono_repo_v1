var tl = require('./TradeLayerRPCAPI.js').tl

var loops = 0

var property1 = 14 // add property 1
var property2 = 15 // add property 2
var address1 = "mnF2UZodmhj1bfFRxJDgUnaLNEL1C66vZd" // add address 1
var address2 = "mzyu2YT3hQoqZcYin72EB9CUGkR1888ARH" // add address 2 
var deleteCount = 50

var intervalMs = 2000

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
            tl.sendtrade(params,function(data, err){
                if(err) {
                    console.log("There is an error with Trade!!!\n", params, err)
                } else {
                    console.log("Successful Trade: \n", data)
                }

            })
            if(loops%deleteCount==0){tl.sendcancelalltrades(address, function(data, err){
                if (err) {
                    console.log("There is an error with trade cancelation !!!\n", err)

                } else {
                    console.log("Successful Trade Cancelation: \n", data)

                }
            })}
        }, intervalMs);
}

tradeBot()
