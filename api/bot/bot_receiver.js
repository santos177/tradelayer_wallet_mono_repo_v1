const client = require('socket.io-client');
const tl = require('./TradeLayerRPCAPI').tl

const URL = 'http://localhost' //replace this with the ip address of the listener, assumes a static ip
const PORT = 9876

const options = {
    address: 'QbbqvDj2bJkeZAu4yWBuQejDd86bWHtbXh', // string
    propertyId: 7, // number
    amount: '10' // string
}

class Receiver {
    constructor(options) {
        this.address = options.address;
        this.propertyId = options.propertyId;
        this.amount = options.amount;
        this.io = client.connect(`${URL}:${PORT}`);

    }
    init() {
        this.io.on('connect', () => {
            console.log('Connected !')
        })

        this.io.on('channelPubKey', (channelPubKey) => {
            this.getNewAddress()
        })

        this.io.on('multisig', (multySigData) => {
            console.log(`Receiving multisig Data`, multySigData)
            this.legitMultisig(multySigData, (legit) => {
                console.log(`Legit the Multisig: ${legit}`)
                if (legit == true) {
                    this.channelMultisig = multySigData.multisig.address
                    this.commitToChannel(this.channelMultisig)
                } else { 
                    return console.log('The client tried to scam with a bad multisig')
                }
            })
        })

        this.io.on('buildRawTx', (unspentArray) => {
            console.log(`Start Building rawTx from unspents: ${unspentArray.length}`)
            // buildTokenToTokenTrade(unspentArray, propertyId1, amount1, propertyId2, amount2, true, (rawTx) => {
            //     console.log(`Builded rawTx: ${rawTx}`)
            //     tl.simpleSign(rawTx, (signedTx) => {
            //         if (!signedTx.complete) return console.error("Fail with signing the rawTX")
            //         const { hex } = signedTx
            //         console.log(`Signed RawTX: ${ hex }`)
            //         io.emit('signedRawTx', hex)
            //     })
            // })
        })
    }

    getNewAddress() {
        tl.getNewAddress(null, (data) => {
            this.receiverChannelAddress = data
            console.log(`Created New Address: ${data}`)
            this.validateAddress(data)
        });
    }

    validateAddress(address) {
        tl.validateAddress(address, (d) => {
            this.receiverChannelPubKey = d.pubkey
            console.log(`Address Validation:`, d)
            this.io.emit('channelPubKey', this.receiverChannelPubKey)
        })
    }

    commitToChannel(multiSigAddress) {
        console.log(`Commit toChannel!`)
        tl.commitToChannel(this.address, multiSigAddress, this.propertyId, this.amount, (data) => {
            console.log(`Commited to The multisig Address, result: ${data}`)
            this.io.emit('multisig')
         })
    }

    legitMultisig(multySigData, cb) {
        console.log('work')
        console.log(2, [multySigData.pubKeyUsed, this.channelPubKey])
        tl.addMultisigAddress(2, [multySigData.pubKeyUsed, this.receiverChannelPubKey], (data) => {
            const legit = data.reedemScript == multySigData.multisig.reedemScript ? true : false
                return cb(legit)
        })
    }
}

const myReceiver = new Receiver(options);
myReceiver.init();