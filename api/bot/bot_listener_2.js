const PORT = 9876;
const listener = require('socket.io')(PORT);
const tl = require('./TradeLayerRPCAPI').tl 

// var client = tl.init('username', 'passwrod', '', true)
const tokenAddress = "QNQGyQs75G2wrdkVhQAVztoU9Ma6EQe1a8"
const propertyId2 = 4
const amount2 = "6"
var channelPubkeyListen = ""
var channelAddressListen = ""
var channelPubKeyReceive = ""
var channelMultisig = ""

listener.on('connection', (io) => {
    console.log(`New Connection! ID: ${io.id}`)
    tl.getNewAddress(null, (data) => {
        channelAddressListen = data
        console.log(`Created New Address: ${data}`)
        tl.validateAddress(data, (d) => {
            channelPubkeyListen = d.pubkey
            console.log(`Address Validation:`, d)
            io.emit('channelPubKey', channelPubkeyListen)
        })
    });
    
    io.on('channelPubKey', (channelPubkey) => {
        channelPubKeyReceive = channelPubkey
        console.log(`Receving second Channel pubKey: ${channelPubkey}`)
        tl.addMultisigAddress(2, [channelPubkeyListen, channelPubKeyReceive], (data) => {
            channelMultisig = data
            const multySigData = {
                'multisig': data,
                'pubKeyUsed': channelPubkeyListen
            }
            console.log(`Created MultisigAddress`, data)
            io.emit('multisig', multySigData)
            const multiSigAddress = multySigData.multisig.address
            tl.commitToChannel(tokenAddress, multiSigAddress, propertyId2, amount2, function(data){
                console.log(`Commited to The multisig Address, result: ${data}`)
                tl.listunspent(0, 9999999, [multiSigAddress], (listunspent) => {
                    console.log(`Sending listunspent to the Receiver for building rawTx: ${listunspent.length} `)
                    io.emit('buildRawTx', listunspent)
                })
            })
        })
    });

    io.on('signedRawTx', (hex) => {
        console.log(`Receiving signedRawTx`)
        tl.simpleSign(hex, (signedTx) => {
            if (!signedTx.complete) return console.error("Fail with signing the rawTX")
            const { hex } = signedTx
            console.log(`coSigned RawTX: ${ hex }`)
            tl.sendRawTransaction(hex, (data) => {
                console.log(`Successfull!`)
                console.log(`Transaction created: ${data}`)
                io.emit('success', data)
            })
        })
    })
});