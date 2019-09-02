class SocketManager {
    constructor(){
        this.sockIdToClient = {}
        this.addressToSockId = {}
        this.sockIdToAddresses = {}
        this.proposedChannels = {}

        this._sendToAllClients = this._sendToAllClients.bind(this)
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
    sendIndication(data, client){
        const { targetAddress, fromAddress } = {data};
        const payload = {
            fromAddress,
            otherData: 'trade info here'
        }
        this._sendMessage("receiveIndicator", payload, {byAddress: targetAddress})
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

    _sendToAllClients(messageStr, payload){
        Object.keys(this.sockIdToClient).forEach((sockId)=>{
            const client = this.sockIdToClient[sockId];
            this._sendMessage(messageStr, payload, {byClient: client})
        })
    }
    proposeChannel(data, client){
        
        const {proposedChannels, _sendToAllClients} = this;        
        if (!proposedChannels[data.id]){
            proposedChannels[data.id] = data;
            _sendToAllClients('receiveChannelProposal', data)
        }
    }
    sendAllChannelsToClient(client){
        this._sendMessage('receiveChannels', this.proposedChannels, {byClient:client})
    }

    
}

module.exports = SocketManager