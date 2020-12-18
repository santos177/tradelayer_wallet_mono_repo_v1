const client = require('socket.io-client');
const tl = require('./TradeLayerRPCAPI').tl

const URL = 'http://localhost' //replace this with the ip address of the listener, assumes a static ip
const PORT = 9876
const io = client.connect(`${URL}:${PORT}`);

const tokenAddress = "QbbqvDj2bJkeZAu4yWBuQejDd86bWHtbXh"
const propertyId = 4
const propertyId2 = 5
const amount = "10";

var channelPubKeyReceive = ""
var channelAddressReceive = ""
var channelPubKeyListen = ""
var channelMultisig = ""
io.on('connect', ()=>{
    console.log('Connected !')
})

io.on('channelPubKey', (channelPubKey) => {
    tl.getNewAddress(null,function(address){
        channelAddressReceive = address
            tl.validateAddress(address, function(data){
                channelPubKeyReceive = data.pubkey
                channelPubKeyListen = channelPubKey
                io.emit('channelPubKey', channelPubKeyReceive)
            })
        })
});

io.on('multisig', (multySigData) => {

    legitMultisig(multySigData, (legit) => {
        if (legit == true) {
            channelMultisig = multySigData
            const multiSigAddress = multySigData.multisig.address
            tl.commitToChannel(tokenAddress, multiSigAddress, propertyId, amount, function(data){
                console.log({data})
                return
             })
        } else { 
            return console.log('The client tried to scam with a bad multisig')
        }
    })
})

function legitMultisig(e, cb){
    tl.addMultisigAddress(2, [channelPubKeyListen, channelPubKeyReceive], function(data){
        const legit = data.reedemScript == e.multisig.reedemScript ? true : false
            return cb(legit)
    })
}