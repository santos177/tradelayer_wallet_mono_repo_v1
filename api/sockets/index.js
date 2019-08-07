const SocketManager = new (require("./manager.js"))();

const handleIoConnection = client => {
  
  SocketManager.handleNewConnection(client)

  client.on("disconnect", function(x) {
    console.log("unregistering:", this.id);
    SocketManager.handleUnregister(this.id);
  });

  client.on("error", function(err) {
    console.log("received error from client:", err);
  });

  client.on("registerAddresses", function(addressData) {
    console.log("resistering", addressData, this.id);
    SocketManager.handleRegisterAddresses(this.id, addressData.addresses);
  });

  client.on('pinger', function(data) {
    console.log('pinged', data);
    
    SocketManager.sendMessage('ponger', {msg: 'pong'}, {byClient: client})
  })
};

module.exports = handleIoConnection;
