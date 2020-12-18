const PORT = 9876;
const listener = require('socket.io')(PORT);
const tl = require('./TradeLayerRPCAPI').tl 

// var client = tl.init('username', 'passwrod', '', true)
const tokenAddress = "QNQGyQs75G2wrdkVhQAVztoU9Ma6EQe1a8"
const propertyId = 4
const propertyId2 = 5
const amount = "10";

var channelPubkeyListen = ""
var channelPubKeyReceive = ""
var channelAddressListen = ""
var channelMultisig = ""

listener.on('connection', (io) => {
    console.log(`New Connection! ID: ${io.id}`)

    let channelComponent = ''

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

            legitMultisig(multySigData, (legit) => {
                if (legit == true) {
                    channelMultisig = multySigData
                    const multiSigAddress = multySigData.multisig.address
                    tl.commitToChannel(tokenAddress, multiSigAddress, propertyId2, amount, function(data){
                        console.log({data})
                        return
                     })
                } else { 
                    return console.log('The client tried to scam with a bad multisig')
                }
            })
        })
        

    })
});

function legitMultisig(e, cb){
    tl.addMultisigAddress(2, [channelPubKeyListen, channelPubKeyReceive], function(data){
        const legit = data.reedemScript == e.multisig.reedemScript ? true : false
            return cb(legit)
    })
}