import socket from '../socket/socketconnect.js'

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

const sendIOI = (channel, fromAddress)=>{
  socket.emit("indicateInterest", {channel, fromAddress})
}

const proposeChannel = (channelData)=>{  
  const data = Object.assign(channelData, {id: Math.random()})
  socket.emit("proposeChannel", {channelData: data})

}

window.pc = proposeChannel

export const socketService = {
    ping, registerAddresses, socket, sendIOI, proposeChannel
}