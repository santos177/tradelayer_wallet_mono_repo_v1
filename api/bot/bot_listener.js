const PORT = 9876;
const listener = require('socket.io')(PORT);
const tl = require('./TradeLayerRPCAPI').tl 

const options = {
    address: 'QNQGyQs75G2wrdkVhQAVztoU9Ma6EQe1a8', // string
    propertyId: 8, // number
    amount: '10' // string
}

class Listener {
    constructor(options) {
        this.address = options.address;
        this.propertyId = options.propertyId;
        this.amount = options.amount;
    }

    init() {
        listener.on('connection', (io) => {
            console.log(`New Connection! ID: ${io.id}`)
            this.io = io;
            this.getNewAddress()

            this.io.on('channelPubKey', (channelPubKey) => {
                console.log('Receive second channelPubKey!')
                this.receiverChannelPubKey = channelPubKey
                this.addMultiSigAddress(this.listenerChannelPubKey, this.receiverChannelPubKey)
            })

            this.io.on('multisig', () => {
                this.listUnspent()
            })

            this.io.on('signedRawTx', (signedRawTx) => {
                console.log('signedRawTx!')
            })

        })
    }

    getNewAddress() {
        tl.getNewAddress(null, (data) => {
            this.listenerChannelAddress = data
            console.log(`Created New Address: ${data}`)
            this.validateAddress(data)
        });
    }

    validateAddress(address) {
        tl.validateAddress(address, (d) => {
            this.listenerChannelPubKey = d.pubkey
            console.log(`Address Validation:`, d)
            this.io.emit('channelPubKey', this.listenerChannelPubKey)
        })
    }

    addMultiSigAddress(channelPubkeyListen, channelPubKeyReceive) {
        tl.addMultisigAddress(2, [channelPubkeyListen, channelPubKeyReceive], (data) => {
            this.channelMultisig = data
            console.log(`Created MultisigAddress`, data)
            this.commitToChannel(data)
        })
    }
    commitToChannel(multiSig) {
        console.log(`Commit toChannel!`)
        tl.commitToChannel(this.address, multiSig.address, this.propertyId, this.amount, (data) => {
            console.log(`Commited to The multisig Address, result: ${data}`)
            const multySigData = {
                 'multisig': multiSig,
                 'pubKeyUsed': this.listenerChannelPubKey
            }
            this.io.emit('multisig', multySigData)
        })
    }

    listUnspent() {
        tl.listunspent(0, 9999999, [this.channelMultisig.address], (listunspent) => {
            console.log(`Sending listunspent to the Receiver for building rawTx: ${listunspent.length} `)
            this.io.emit('buildRawTx', listunspent)
        })
    }
}

const myListener = new Listener(options);
myListener.init();