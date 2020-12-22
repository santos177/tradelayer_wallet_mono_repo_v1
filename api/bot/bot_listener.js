const PORT = 9876;
const listener = require('socket.io')(PORT);
const tl = require('./TradeLayerRPCAPI').tl 

// var client = tl.init('username', 'passwrod', '', true)
const tokenAddress = "QNQGyQs75G2wrdkVhQAVztoU9Ma6EQe1a8"
const propertyId = 4
const propertyId2 = 5
const amount = "10";

var channelPubkeyListen = ""
var channelAddressListen = ""
var channelPubKeyReceive = ""
var channelMultisig = ""

listener.on('connection', (io) => {
    console.log(`New Connection! ID: ${io.id}`)

    tl.getNewAddress(null, (data) => {
        channelAddressListen = data
        tl.validateAddress(data, (d) => {
            channelPubkeyListen = d.pubkey
            io.emit('channelPubKey', channelPubkeyListen)
        })
    });
    
    io.on('channelPubKey', (channelPubkey) => {
        channelPubKeyReceive = channelPubkey
        tl.addMultisigAddress(2, [channelPubkeyListen, channelPubKeyReceive], (data) => {
            channelMultisig = data
            const multySigData = {
                'multisig': data,
                'pubKeyUsed': channelPubkeyListen
            }
            io.emit('multisig', multySigData)
            tl.commitToChannel(tokenAddress, multiSigAddress, propertyId2, amount, function(data){
                console.log({commitToChannel: data})
                // tl.listunspent(0, 9999999, [multiSigAddress], (listunspnet) => {
                //     io.emit('buildRawTx', listunspnet)
                // })
                return
             })
        })
    });

    io.on('signedRawTx', (hex) => {
        tl.simpleSign(hex, (signedTx) => {
            if (!signedTx.complete) return console.error("Fail with signing the rawTX")
            const { hex } = signedTx
            console.log({hex})
        })
    })
});