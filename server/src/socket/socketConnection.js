import singleChatSocket from "./singleChatSocket.js";
import groupChatSocket from "./groupChatSocket.js";

class socketConnection {
  constructor(io) {
    this.io = io;
  }

  connect() {
    this.io.on("connection", (socket) => {
      new singleChatSocket(socket, this.io);
      new groupChatSocket(socket, this.io);
    });
  }
}

export default socketConnection;