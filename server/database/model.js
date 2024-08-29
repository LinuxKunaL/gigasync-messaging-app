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
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  isAvatar: { type: Boolean, default: false },
  avatarColor: { type: String },
  createdAt: { type: Date, default: Date.now },
  contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  allChats: [{ type: Schema.Types.ObjectId, ref: "User" }],
  favoritesChats: [{ type: Schema.Types.ObjectId, ref: "User" }],
  socketId: String,
  status: { type: String, default: "offline" },
  lastSeen: { type: Date, default: Date.now },
  mediaStatus: [
    {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      type: { type: String },
      file: { type: String },
      caption: { type: String },
    },
  ],
  files: [
    {
      url: { type: String },
      type: { type: String },
      name: { type: String },
      size: { type: Number },
      chat: { type: String },
      chatId: { type: String },
      timestamp: { type: Date, default: Date.now },
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
        links: [
          {
            type: String,
          },
        ],
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
  isMessageSeen: { type: Boolean, default: false },
});

const GroupsSchema = new Schema({
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
      isVoiceAllowed: { type: Boolean, default: true },
      isAudioAllowed: { type: Boolean, default: true },
      isFileAllowed: { type: Boolean, default: true },
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
        links: [
          {
            type: String,
          },
        ],
      },
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      replyMessage: {
        id: { type: String },
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

const OtpSchema = new Schema({
  email: { type: String },
  otp: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Otp = mongoose.model("Otp", OtpSchema);
export const User = mongoose.model("User", UserSchema);
export const ChatModel = mongoose.model("Chat", ChatSchema);
export const groups = mongoose.model("groups", GroupsSchema);
