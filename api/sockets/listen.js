const tl = require('../bot/TradeLayerRPCAPI').tl

var dataSub = 
    {
    "jsonrpc": "2.0",
     "method": "public/get_index_price",
     "id": 42,
     "params": {
        "index_name": "btc_usd"}
    };
let myChannelMultisig = '';
let channelComponent = '';
let myChannelPubkey = '';
let BTCUSD = 1


module.exports = (io) => {
    console.log('Listener Work!')
    tl.getnewaddress(null, (data) => {
        channelComponent = data
        tl.validateaddress(data, (d) => {
            myChannelPubkey = d.scriptPubKey
        })
    });

    io.emit('dataSub', JSON.stringify(dataSub))
    io.emit('channelPubKey', JSON.stringify(myChannelPubkey))

    io.on('deribitJSON', (data) => {
        BTCUSD = data.result.index_price
    })

    io.on('pubKey', (data) => {
        tl.addmultisigaddress(2, [data, channelSingleSigAddress], (data) => {
            myChannelMultisig = data
            const multisig = {
                'multisig': data,
                'pubKeyUsed': myChannelPubKey
            }
            io.emit('multisig', multisig)
        })
    })

    io.on('multisig', (data) => {
        shouldCoSign(data, (sign, data) => {
            if (sign === true) {
                tl.simplesign(data, (data) => {
                    io.emit('something', data)
                })
            }
        })
    })
}