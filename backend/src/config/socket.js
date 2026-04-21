const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
}

module.exports = initSocket;
module.exports.getIO = getIO;
