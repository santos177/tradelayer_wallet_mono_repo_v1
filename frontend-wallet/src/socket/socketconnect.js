const io = require("socket.io-client");

export default io.connect(process.env.SOCKET_URL);
