var tl = require('./TradeLayerRPCAPI.js').tl

var loops = 0
var property1 = 11 // add property 1
var property2 = 10 // add property 2
var address1 = "QPjSYKp8nhP9oxKGf2xLjbeX7SZKV6d9Ye" // add address 1
var address2 = "QbooMX7a4kCApaGmyvHBGXxYiZBCyUoPeb" // add address 2 
var deleteCount = 50
var intervalMs = 2000

function tradeBot(){
    setInterval(function(){
            loops +=1
            var amount1 =  Math.random()>=0.5 ? 0.1 : 0.2
            var amount2 = Math.random()*0.2
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
                    console.log("There is an error with Trade!!!\n", err)
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
