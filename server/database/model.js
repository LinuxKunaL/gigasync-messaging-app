import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  fullName: { type: String },
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String },
  profile: {
    privacy: {
      profilePhoto: { type: Boolean, default: true },
      about: { type: Boolean, default: true },
      status: { type: Boolean, default: true },
    },
    about: { type: String, default: "I'm using GigaSync App" },
    avatar: { type: String },
  },
  isAvatar: { type: Boolean, default: false },
  avatarColor: { type: String },
  createdAt: { type: Date, default: Date.now },
  contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  allChats: [{ type: Schema.Types.ObjectId, ref: "User" }],
  socketId: String,
  status: { type: String, default: "offline" },
  lastSeen: { type: Date, default: Date.now },
  mediaStatus: [
    {
      createdAt: { type: Date, default: Date.now },
      expiredAt: { type: Date },
      type: { type: String },
      file: { type: String },
      caption: { type: String },
    },
  ],
});

const ChatSchema = new Schema({
  chatWithin: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [
    {
      timestamp: { type: Date, default: Date.now },
      message: {
        file: {
          type: {
            type: String,
          },
          name: {
            type: String,
          },
          size: {
            type: Number,
          },
        },
        text: {
          type: String,
        },
      },
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
      replyMessage: {
        to: { type: Schema.Types.ObjectId, ref: "User" },
        message: {
          file: {
            type: {
              type: String,
            },
            name: {
              type: String,
            },
            size: {
              type: Number,
            },
          },
          text: {
            type: String,
          },
        },
      },
    },
  ],
});

const groupsSchema = new Schema({
  groupDetails: {
    name: { type: String, unique: true },
    description: { type: String },
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  groupMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  groupSetting: {
    private: { type: Boolean, default: true },
    privacy: {
      isPhotoAllowed: { type: Boolean, default: true },
      isVideoAllowed: { type: Boolean, default: true },
      isChatAllowed: { type: Boolean, default: true },
    },
  },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  messages: [
    {
      timestamp: { type: Date, default: Date.now },
      message: {
        file: {
          type: {
            type: String,
          },
          name: {
            type: String,
          },
          size: {
            type: Number,
          },
        },
        text: {
          type: String,
        },
      },
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      replyMessage: {
        to: { type: Schema.Types.ObjectId, ref: "User" },
        message: {
          file: {
            type: {
              type: String,
            },
            name: {
              type: String,
            },
            size: {
              type: Number,
            },
          },
          text: {
            type: String,
          },
        },
      },
    },
  ],
});

export const ChatModel = mongoose.model("Chat", ChatSchema);
export const User = mongoose.model("User", UserSchema);
export const groups = mongoose.model("groups", groupsSchema);
