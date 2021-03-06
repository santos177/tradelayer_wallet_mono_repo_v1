class SocketManager {
      /**
       * socketId is a unique, randomly assigned string
       * mapping below are maintained to ensure constant retreival:
    * @param sockIdToClient map socketId (String) to client object
    * @param addressToSockId map public address (String) to socketId (String). Note that many-to-one is likely
    * @param sockIdToAddresses map public address (String) to socketId (String).
    * @param proposedChannels map randomly generated (by client) channelId (String) to channel data (Obj)
   */
    constructor(){
        this.sockIdToClient = {}
        this.addressToSockId = {}
        this.sockIdToAddresses = {}
        this.proposedChannels = {}

        this._sendToAllClients = this._sendToAllClients.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
    }

    handleRegisterAddresses(sockId, addressArray){
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
        const { channel, fromAddress } = data;
        const payload = {
            fromAddress,
            otherData: 'trade info here'
        }
        this._sendMessage("receiveIndicator", payload, {byAddress: channel.address})
    }

       /**
       * Private, sends message
    * @param messageStr (String) message type, i.e, "ponger"
    * @param payload (Obj) data to send
    * @param options (Obj) object specifiying how to reach target; byClient, bySockId, and byAddress are all supported
   */
    _sendMessage(messageStr, payload, options){        
        const {sockIdToClient, addressToSockId, sockIdToAddresses} = this;

        let client;
        if (options.byClient){
            client = options.byClient
        } else if (options.bySockId){
            client = sockIdToClient[options.bySockId]
        } else if (options.byAddress){
            client =   sockIdToClient[addressToSockId[options.byAddress]]
        }
        if (client){
            client.emit(messageStr, payload)
        }  else {
            console.warn('client not found');  
        }
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