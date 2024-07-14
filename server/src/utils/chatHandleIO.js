import { ChatModel, User } from "../../database/model.js";
import { uploadFile } from "./fileOperations.js";

class ChatHandleIO {
  constructor(io) {
    this.io = io;
    this.sendMessage = this.sendMessage.bind(this);
    this.selectContact = this.selectContact.bind(this);
    this.register = this.register.bind(this);
  }

  async sendMessage(data) {
    const { me, to, message, socketId, replyMessage } = data;
    const { file } = message;

    var fileData = {
      size: null,
      type: null,
      name: null,
    };

    const receiver = await User.findById(to);

    if (!receiver.allChats.includes(me)) {
      receiver.allChats.push(me);
      await receiver.save();
    }

    const sender = await User.findById(me);

    if (!sender.allChats.includes(to)) {
      sender.allChats.push(to);
      await sender.save();
    }

    const receiverSocketId = receiver ? receiver.socketId : null;

    const chat = await ChatModel.findOne({
      chatWithin: { $all: [me, to] },
    });

    if (file.type !== "text") {
      fileData = uploadFile(file.data, me);
    }

    if (!chat) {
      const newMessage = await ChatModel.create({
        chatWithin: [me, to],
      });

      newMessage.messages.push({
        message: {
          file: {
            type: fileData.type ? file.type : "text",
            name: fileData.name,
            size: fileData.size,
          },
          text: message.text,
        },
        sender: me,
        receiver: to,
        replyMessage,
      });

      await newMessage.save();

      const populatedChat = await newMessage.populate({
        path: "messages.sender messages.receiver messages.replyMessage.to",
        select: "fullName username avatarColor isAvatar",
        options: { strictPopulate: false },
      });

      this.io
        .to(receiverSocketId)
        .emit("receiveMessage", populatedChat.messages[0]);
      this.io.to(socketId).emit("receiveMessage", populatedChat.messages[0]);
      this.io
        .to(receiverSocketId)
        .emit("NewMessageNotification", populatedChat.messages[0]);

      return null;
    }

    chat.messages.push({
      message: {
        file: {
          type: fileData.type ? file.type : "text",
          name: fileData.name,
          size: fileData.size,
        },
        text: message.text,
      },
      sender: me,
      receiver: to,
      replyMessage,
    });

    await chat.save();

    const populatedChat = await chat.populate({
      path: "chatWithin messages.sender messages.receiver messages.replyMessage.to",
      select: "fullName username avatarColor isAvatar",
      options: { strictPopulate: false },
    });

    const newMessage =
      populatedChat.messages[populatedChat.messages.length - 1];

    this.io.to(receiverSocketId).emit("receiveMessage", newMessage);
    this.io.to(socketId).emit("receiveMessage", newMessage);
    this.io.to(receiverSocketId).emit("NewMessageNotification", newMessage);
  }

  async deleteMessage(data) {
    const { sender, receiver, messageId } = data;

    const _receiver = await User.findById(receiver);
    const _receiverSocketId = _receiver ? _receiver.socketId : null;

    await ChatModel.findOneAndUpdate(
      {
        chatWithin: { $all: [sender, receiver] },
        "messages._id": messageId,
      },
      {
        $set: {
          "messages.$.message.text": "message deleted",
          "messages.$.message.file.type": "del",
          "messages.$.message.file.name": null,
          "messages.$.message.file.size": null,
        },
      },
      {
        new: true,
      }
    );

    this.selectContact({
      me: sender,
      to: receiver,
      socketId: data.socketId,
    });

    this.selectContact({
      me: receiver,
      to: sender,
      socketId: _receiverSocketId,
    });
  }

  async selectContact(data) {
    const chats = await ChatModel.findOne(
      {
        chatWithin: { $all: [data.me, data.to] },
      },
      {
        messages: 1,
      }
    ).populate({
      path: "messages.sender messages.receiver messages.replyMessage.to",
      select: "fullName username avatarColor isAvatar",
      options: { strictPopulate: false },
    });

    this.io
      .to(data.socketId)
      .emit("initialMessage", !chats ? [] : chats.messages);
  }

  async emitStatus(socketId) {
    const userForSocketId = await User.findOne({ socketId });

    const chat = await ChatModel.findOne(
      {
        chatWithin: { $all: [userForSocketId?._id] },
      },
      {
        chatWithin: 1,
        _id: 0,
      }
    ).populate({
      path: "chatWithin",
      select: "socketId",
    });
    this.io.emit("status", chat?.chatWithin);
  }

  async register(userId, socketId) {
    const data = {
      socketId: socketId,
      lastSeen: Date.now(),
      status: "online",
    };

    await User.findByIdAndUpdate(userId, data);
    this.emitStatus(socketId);
  }

  async unRegister(socketId) {
    const data = {
      socketId: socketId,
      lastSeen: Date.now(),
      status: "offline",
    };

    await User.findOneAndUpdate({ socketId }, data);
    this.emitStatus(socketId);
  }

  run() {
    this.io.on("connection", (socket) => {
      socket.on("selectContact", (data) => this.selectContact(data));
      socket.on("sendMessage", (data) =>
        this.sendMessage({ ...data, socketId: socket.id })
      );
      socket.on("register", (userId) => this.register(userId, socket.id));
      socket.on("disconnect", () => this.unRegister(socket.id));
      socket.on("deleteMessage", (data) =>
        this.deleteMessage({ ...data, socketId: socket.id })
      );
    });
  }
}

export default ChatHandleIO;