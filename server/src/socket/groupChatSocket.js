import { groups, User } from "../../database/model.js";
import { uploadFile } from "../utils/fileOperations.js";

class groupChatSocket {
  constructor(socket, io) {
    /**
     * Constructor to initialize socket and io
     * @param {Object} socket - The socket instance for the connected client
     * @param {Object} io - The Socket.io server instance
     */
    this.socket = socket;
    this.io = io;

    /** ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     * @Init socket @events for handles @groupsChatMessage
     */
    this.socket.on("selectGroup", this.selectGroup.bind(this));
    this.socket.on("sendMessage-group", this.sendMessage.bind(this));
    //━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  }

  /**━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * @functions for handle @groupsChatMessage
   */
  async selectGroup(data) {
    const { groupId } = data;

    this.socket.join(groupId);

    const group = await groups
      .findById(
        { _id: groupId },
        {
          messages: 1,
        }
      )
      .populate({
        path: "messages.sender messages.replyMessage.to",
        select: "fullName username avatarColor isAvatar",
        options: { strictPopulate: false },
      });

    this.io.to(groupId).emit("initialMessage-group", group.messages);
  }

  async sendMessage(data) {
    const { groupId, message, sender } = data;
    const { file } = message;

    var fileData = {
      size: null,
      type: null,
      name: null,
    };

    if (file.type !== "text") {
      fileData = uploadFile(file.data, groupId, "group");
    }

    const newMessage = {
      timestamp: Date.now(),
      message: {
        file: {
          type: fileData.type ? file.type : "text",
          name: fileData.name,
          size: fileData.size,
        },
        text: message.text,
      },
      sender,
    };

    const group = await groups.findById({ _id: groupId });
    group.messages.push(newMessage);
    group.save();

    const user = await User.findById(
      { _id: sender },
      {
        username: 1,
        fullName: 1,
        avatarColor: 1,
        isAvatar: 1,
      }
    );

    const populateMessage = {
      ...group.messages.pop().toObject(),
      sender: { ...user.toObject() },
    };

    this.io.to(groupId).emit("receiveMessage-group", {
      groupId,
      message: populateMessage,
    });
  }
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
}

export default groupChatSocket;
