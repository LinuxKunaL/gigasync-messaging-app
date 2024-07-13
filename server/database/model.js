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
});

const ChatSchema = new Schema({
  chatWithin: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  latestMessage: {
    timestamp: { type: Date, default: Date.now },
    message: {
      fileType: { type: String },
      text: {
        type: String,
      },
    },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
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
  media: {
    images: [{ type: String }],
    videos: [{ type: String }],
    audios: [{ type: String }],
    link: [{ type: String }],
    files: [{ type: String }],
    voices: [{ type: String }],
  },
});

export const ChatModel = mongoose.model("Chat", ChatSchema);
export const User = mongoose.model("User", UserSchema);
