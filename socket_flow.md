### Websocket Flow

Websocket architecture includes a client and server role; the server is responsible for tracking of the currently connected clients and their addresses, storing the state of the currently proposed channels, relaying messages between clients. 

The client/server roles are responsible for listening for the following events, respectively:

Server:
- connection
- registerAddresses
- indicateInterest
- proposeChannel
- disconnect

Client: 
- receiveChannels
- receiveChannelProposal
- receiveIndicator
- requestAddresses


#### Flow

Assume several clients, including Bob, are currently active. Alice, a new client is about to join.

##### Setup

1. Alice logs in; she sends sends a `connection` request (see `socketconnect.js`) to the server . The server stores her client / socket id informatin (see below).
2. The server sends Alice back a `requestAddresses` message. 
3. Alice responds with a `registerAddresses` message back to the server, which includes an array of her public addresses. The server stores these addresses, and maps/associates them with her client/socket id (see below).
4. (Asynchronously along with steps 2-3): server sends a `receiveChannels`to Alice; Alice receives the current state of the currently proposed channels.

#### Runtime
**Alice Proposes a new Channel:** 
- Alice sends a `proposeChannel` request (see `socket.service.js` with data (data in Wallet.vue):
```js
       socketService.proposeChannel({
         marginBalance: channelBalance,
          quotePrice: channelPrice,
          unpublishedTradeSize: quantity,
          address: publicAddress
       })
```
- Server stores the new channel state and sends `receiveChannelProposal` to all clients; all clients now have latest proposed-channel states.

**Alice Indicates interest in a Proposed Channel:** 
- Alice calls `indicateInterest` for a channel Bob has set up; she includes the channel and address in her message.
- Server sends a `receiveIndicator` message to Bob (using his address) letting him know of Alice's interest; they are ready to open a channel together now.


Sending a message to a client from the server requires access to the appropriate `client` object; for convenience / if/when the client object isn't directly accessible, client objects can be looked up by public address or by the client's unique socket id; hashmaps `sockIdToClient`, `addressToSockId`,`sockIdToAddresses` are maintained keeping these up to date. `_sendMessage` makes an option hash, which specifies target either `byClient`, `byAddress`, or `bySockId`

Note that `_sendMessage` can be used for arbitrary data and arbitrary message types, though suggested use to give an explicit wrapper-method for each new message type (i.e., see `sendPong`).