class SocketManager {
    constructor(){
        this.sockIdToClient = {}
        this.addressToSockId = {}
        this.sockIdToAddresses = {}

    }

    handleRegisterAddresses(sockId, addressArray){
        // TODO: handle no client object?
        const {sockIdToClient, addressToSockId, sockIdToAddresses} = this;

        const client = sockIdToClient[sockId]

        addressArray.forEach((address)=>{
            addressToSockId[address] = sockId;
        })

        sockIdToAddresses[sockId] = addressArray
    }
    handleNewConnection(client){
        console.log('new io connection', client.id);
        
        this.sockIdToClient[client.id] = client
        this.requestAddressses({byClient: client})
    }
    handleUnregister(sockId){
        const {sockIdToClient, addressToSockId, sockIdToAddresses} = this;

        delete sockIdToClient[sockId] 

        const addresses = sockIdToAddresses[sockId];
        addresses && addresses.forEach((address)=>{
            delete addressToSockId[address]
        })

        delete sockIdToAddresses[sockId]

    }

    sendPong(options){
        this._sendMessage('ponger', {msg: 'pong'}, options)
    }
    requestAddressses(options){
        
        this._sendMessage('requestAddresses', {}, options)
    }
    _sendMessage(messageStr, payload, options){
        console.warn('message:', messageStr);
        
        const {sockIdToClient, addressToSockId, sockIdToAddresses} = this;

        let client;
        if (options.byClient){
            client = options.byClient
        } else if (options.bySockId){
            client = sockIdToClient[options.bySockId]
        } else if (options.byAddress){
            client =   sockIdToClient[addressToSockId[options.byAddress]]
        }

        client.emit(messageStr, payload)
    }
}

module.exports = SocketManager