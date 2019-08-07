const io = require("socket.io-client");

const socket = io.connect(process.env.SOCKET_URL);

socket.on("ponger", (data) => {
  console.warn("pong", data);
});


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

export const socketService = {
    ping, registerAddresses, socket
}