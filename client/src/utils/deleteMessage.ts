import socket from "../app/Socket";

export const deleteMessage = (param: any) => {
    socket.emit("deleteMessage", param);
  };