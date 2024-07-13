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

    console.log(data);
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
        latestMessage: {
          message: {
            fileType: fileData.type ? file.type : "text",
            text: message.text,
          },
          sender: me,
          receiver: to,
        },
        // media: {
        //   images: fileData.type === "image" ? fileData.data : null,
        //   videos: fileData.type === "video" ? fileData.data : null,
        //   documents: fileData.type === "document" ? fileData.data : null,
        //   audios: fileData.type === "audio" ? fileData.data : null,
        // },
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

    // chat.media = {
    //   images: fileData.type === "image" ? fileData.data : null,
    //   videos: fileData.type === "video" ? fileData.data : null,
    //   documents: fileData.type === "document" ? fileData.data : null,
    //   audios: fileData.type === "audio" ? fileData.data : null,
    // }

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

    chat.latestMessage = {
      message: {
        fileType: fileData.type ? file.type : "text",
        text: message.text,
      },
      sender: me,
      receiver: to,
    };

    await chat.save();

    const populatedChat = await chat.populate({
      path: "chatWithin latestMessage.sender messages.sender messages.receiver messages.replyMessage.to",
      select: "fullName username avatarColor isAvatar",
      options: { strictPopulate: false },
    });

    const newMessage =
      populatedChat.messages[populatedChat.messages.length - 1];

    this.io.to(receiverSocketId).emit("receiveMessage", newMessage);
    this.io.to(socketId).emit("receiveMessage", newMessage);
    this.io.to(receiverSocketId).emit("NewMessageNotification", newMessage);
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
    });
  }
}

export default ChatHandleIO;
