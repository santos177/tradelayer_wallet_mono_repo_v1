const io = require("socket.io-client");

const socket = io.connect(process.env.SOCKET_URL);

socket.on("ponger", (data) => {
  console.warn("pong", data);
});

socket.on('receiveIndicator', (data)=>{
  console.warn('interest received:', data);
  
})

const registerAddresses = (addresses) => {
  socket.emit("registerAddresses", { addresses }, () => {
    console.warn("done");
  });
};

const ping = () => {
  socket.emit("pinger", { msg: "ping" }, () => {
    console.log("done");
  });
};

const sendIOI = (targetAddress, fromAddress)=>{
  socket.emit("indicateInterest", {targetAddress, fromAddress})
}

export const socketService = {
    ping, registerAddresses, socket, sendIOI
}