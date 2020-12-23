const client = require('socket.io-client');
const tl = require('./TradeLayerRPCAPI').tl

const URL = 'http://localhost' //replace this with the ip address of the listener, assumes a static ip
const PORT = 9876
const io = client.connect(`${URL}:${PORT}`);

const tokenAddress = "QbbqvDj2bJkeZAu4yWBuQejDd86bWHtbXh"
const propertyId1 = 5
const propertyId2 = 4
const amount1 = "42";
const amount2 = "6"

var channelPubKeyReceive = ""
var channelAddressReceive = ""
var channelPubKeyListen = ""
var channelMultisig = ""
io.on('connect', ()=>{
    console.log('Connected !')
})

io.on('channelPubKey', (channelPubKey) => {
    tl.getNewAddress(null,function(address){
        console.log(`Created New Address: ${address}`)
        channelAddressReceive = address
            tl.validateAddress(address, function(d){
                channelPubKeyReceive = d.pubkey
                channelPubKeyListen = channelPubKey
                console.log(`Address Validation:`, d)
                io.emit('channelPubKey', channelPubKeyReceive)
            })
        })
});

io.on('multisig', (multySigData) => {
    console.log(`Receiving multisig Data`, multySigData)
    legitMultisig(multySigData, (legit) => {
        console.log(`Legit the Multisig: ${legit}`)
        if (legit == true) {
            channelMultisig = multySigData
            const multiSigAddress = multySigData.multisig.address
            tl.commitToChannel(tokenAddress, multiSigAddress, propertyId1, amount1, function(data){
                console.log(`Commited to The multisig Address, result: ${data}`)
             })
        } else { 
            return console.log('The client tried to scam with a bad multisig')
        }
    })
})

io.on('buildRawTx', (unspentArray) => {
    console.log(`Start Building rawTx from unspents: ${unspentArray.length}`)
    buildTokenToTokenTrade(unspentArray, propertyId1, amount1, propertyId2, amount2, true, (rawTx) => {
        console.log(`Builded rawTx: ${rawTx}`)
        tl.simpleSign(rawTx, (signedTx) => {
            if (!signedTx.complete) return console.error("Fail with signing the rawTX")
            const { hex } = signedTx
            console.log(`Signed RawTX: ${ hex }`)
            io.emit('signedRawTx', hex)
        })
    })
})

io.on('success', (data) => {
    console.log(`Successfull!`)
    console.log(`Transaction created: ${data}`)
})

function legitMultisig(e, cb){
    tl.addMultisigAddress(2, [channelPubKeyListen, channelPubKeyReceive], function(data){
        const legit = data.reedemScript == e.multisig.reedemScript ? true : false
            return cb(legit)
    })
}



function buildTokenToTokenTrade(inputs, id1, amount1, id2, amount2, secondSigner = true, cb) {
    tl.getBlock(null, (block) => {
        const height = block.height + 3
        tl.createpayload_instant_trade(id1, amount1, id2, amount2, height, (payload) => {
            //set refAddress to null to skip adding reffaddress
            tl.buildRawAsync(inputs, payload, null, (rawTx) => {
                cb(rawTx)
            })
        })
    })
}
