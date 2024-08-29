import { ChatModel, groups, User } from "../../database/model.js";
import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { io } from "../server.js";

import config from "../../config/config.js";
import fs from "fs";
import fse from "fs-extra";
import multer from "multer";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const profileUpdate = async (req, res) => {
  await User.findByIdAndUpdate(req.body._id, { ...req.body })
    .then(() => {
      return res.status(200).send({ success: true });
    })
    .catch((err) => {
      if (err.code === 11000) {
        console.log("username is already used");
        return res.status(406).send("username is already used");
      }
    });
};

const searchProfiles = async (req, res) => {
  const { query } = req.body;
  const { userId } = req;

  if (query === "") return res.status(200).send([]);

  const user = await User.find(
    {
      $or: [
        { username: { $regex: query, $options: "i" }, _id: { $ne: userId } },
        { fullName: { $regex: query, $options: "i" }, _id: { $ne: userId } },
      ],
    },
    {
      _id: 1,
      username: 1,
      fullName: 1,
      avatarColor: 1,
      isAvatar: 1,
      "profile.privacy.profilePhoto": 1,
    }
  );
  return res.status(200).send(user);
};

const handleContactOperations = async (req, res) => {
  if (req.method === "GET") {
    const { userId } = req;

    const { contacts } = await User.findById(userId, {
      contacts: 1,
    }).populate({
      path: "contacts",
      select:
        "fullName username avatarColor isAvatar status lastSeen profile.privacy.profilePhoto",
    });

    if (contacts.length === 0) return res.status(200).send([]);

    return res.status(200).send(contacts);
  } else if (req.method === "PUT") {
    const { contactId } = req.body;
    const { userId } = req;

    const user = await User.findById(userId);

    if (user.contacts.includes(contactId)) {
      return res.status(406).send("Already added");
    }

    user.contacts.push(contactId);
    await user.save();

    return res.status(200).send({ success: true });
  } else if (req.method === "DELETE") {
    const { contactId } = req.query;
    const { userId } = req;
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          contacts: contactId,
        },
      }
    );
    return res.status(200).send({ success: true });
  }
};

const populateFavorite = async (req, res) => {
  const { contacts } = req.body;
  try {
    const users = await User.find(
      { _id: { $in: contacts } },
      {
        _id: 1,
        username: 1,
        fullName: 1,
        avatarColor: 1,
        isAvatar: 1,
        status: 1,
        lastSeen: 1,
        "profile.privacy.profilePhoto": 1,
      }
    );

    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const clearChat = async (req, res) => {
  const { me, to, operation } = req.body;
  try {
    await ChatModel.findOneAndUpdate(
      {
        chatWithin: { $all: [me, to] },
      },
      {
        $set: {
          messages: [],
        },
      }
    );

    const receiver = await User.findById(to);
    const sender = await User.findById(me);

    sender.files.map((file) => {
      if (file.chatId === me + to) {
        const paths = path.join(__dirname, "../", "data", file.url);
        const exists = fs.existsSync(paths);
        if (exists) fs.unlinkSync(paths, { recursive: true });
      }
    });

    receiver.files.map((file) => {
      if (file.chatId === to + me) {
        const paths = path.join(__dirname, "../", "data", file.url);
        const exists = fs.existsSync(paths);
        if (exists) fs.unlinkSync(paths, { recursive: true });
      }
    });

    receiver.files = receiver.files.filter(
      (file) => file.chatId.toString() != (to + me).toString()
    );

    sender.files = sender.files.filter(
      (file) => file.chatId.toString() != (me + to).toString()
    );

    if (operation === "delete") {
      receiver.allChats = receiver.allChats.filter(
        (item) => item.toString() !== me
      );
      sender.allChats = sender.allChats.filter(
        (item) => item.toString() !== to
      );

      await ChatModel.findOneAndDelete({
        chatWithin: { $all: [me, to] },
      });

      io.to(receiver.socketId).emit("loadChats");
      io.to(sender.socketId).emit("loadChats");
    }

    await receiver.save();
    await sender.save();

    io.to(receiver.socketId).emit("initialMessage");
    io.to(sender.socketId).emit("initialMessage");

    return res.status(200).send(`Chat ${operation} successfully`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
};

const getProfileData = async (req, res) => {
  const { userId } = req;
  const { _id } = req.body;

  const me = await User.findById(userId, {
    "profile.blockedUsers": 1,
  });

  const to = await User.findById(_id, {
    "profile.blockedUsers": 1,
  });

  const isBlockedForMe = me?.profile?.blockedUsers?.includes(_id);
  const isBlockedForUser = to?.profile?.blockedUsers?.includes(userId);

  const user = await User.findById(_id, {
    _id: 1,
    username: 1,
    fullName: 1,
    avatarColor: 1,
    isAvatar: 1,
    status: 1,
    lastSeen: 1,
    socketId: 1,
    "profile.privacy.profilePhoto": 1,
  });

  return res
    .status(200)
    .send({ ...user.toJSON(), isBlockedForUser, isBlockedForMe });
};

const getAllChat = async (req, res) => {
  const { userId } = req;
  try {
    const { allChats } = await User.findOne(
      { _id: userId },
      {
        allChats: 1,
        _id: 0,
      }
    ).populate({
      path: "allChats",
      select:
        "fullName username avatarColor isAvatar profile.privacy.profilePhoto",
    });

    const modifiedChats = await Promise.all(
      allChats.map(async (user) => {
        const getMessages = await ChatModel.findOne(
          {
            chatWithin: { $all: [user.id, userId] },
          },
          {
            messages: 1,
            _id: 0,
          }
        );
        return {
          message:
            getMessages?.messages[getMessages?.messages.length - 1]?.message,
          user,
          timestamp:
            getMessages?.messages[getMessages?.messages.length - 1]?.timestamp,
        };
      })
    );

    if (allChats.length <= 0) {
      return res.status(200).send([]);
    }

    return res.status(200).send(modifiedChats);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const toggleBlockContact = async (req, res) => {
  const { to, block } = req.body;
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    if (block) {
      user.profile.blockedUsers.push(to);
    } else {
      user.profile.blockedUsers.splice(
        user.profile.blockedUsers.indexOf(to),
        1
      );
    }
    const { socketId } = await User.findById(to);
    io.to(socketId).emit("refreshBlockedUser", userId);
    user.save();
    return res.status(200).send({ success: true });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getAllFiles = async (req, res) => {
  const { userId } = req;

  try {
    const { files } = await User.findById(userId);

    // const videos = fs.readdirSync(
    //   path.join(__dirname, "../", "data", `user-${userId}`, "videos")
    // );
    // const images = fs.readdirSync(
    //   path.join(__dirname, "../", "data", `user-${userId}`, "images")
    // );
    // const files = fs.readdirSync(
    //   path.join(__dirname, "../", "data", `user-${userId}`, "files")
    // );
    // const audios = fs.readdirSync(
    //   path.join(__dirname, "../", "data", `user-${userId}`, "audios")
    // );

    // console.log({ videos, images, files, audios });

    return res.status(200).send(files);
  } catch (error) {
    console.log(error);
  }
};

const getChatWithinData = async (req, res) => {
  const { me, to } = req.body;

  try {
    const chat = await ChatModel.findOne({
      chatWithin: { $all: [me, to] },
    });

    var media = {
      images: [],
      videos: [],
      audios: [],
    };

    var files = [];
    var voices = [];

    chat?.messages.map((msg) => {
      if (msg.message.file.type === "image") {
        media.images.push(
          `${config.server.host}/api/default/getMedia/user-${msg.sender._id}/images/${msg.message.file.name}`
        );
      }
      if (msg.message.file.type === "video") {
        media.videos.push(
          `${config.server.host}/api/default/getMedia/user-${msg.sender._id}/videos/${msg.message.file.name}`
        );
      }
      if (msg.message.file.type === "audio") {
        media.audios.push(
          `${config.server.host}/api/default/getMedia/user-${msg.sender._id}/audios/${msg.message.file.name}`
        );
      }
      if (msg.message.file.type === "file") {
        files.push({
          name: msg.message.file.name,
          url: `${config.server.host}/api/default/getMedia/user-${msg.sender._id}/files/${msg.message.file.name}`,
          size: msg.message.file.size,
          date: msg.timestamp,
          format: msg.message.file.name.split(".")[1],
        });
      }
      if (msg.message.file.type === "recording") {
        voices.push({
          name: msg.message.file.name,
          url: `${config.server.host}/api/default/getMedia/user-${msg.sender._id}/recordings/${msg.message.file.name}.mp3`,
          size: msg.message.file.size,
          date: msg.timestamp,
        });
      }
    });

    const userTo = await User.findById(to, {
      _id: 1,
      username: 1,
      fullName: 1,
      isAvatar: 1,
      avatarColor: 1,
      "profile.about": 1,
      "profile.privacy.about": 1,
      "profile.privacy.profilePhoto": 1,
    });

    const {
      profile: { blockedUsers },
    } = await User.findById(me, {
      "profile.blockedUsers": 1,
    });

    const isBlocked = blockedUsers?.includes(to);

    const links = chat?.messages.flatMap((msg) =>
      msg.message.links.map((link) => link)
    );

    const modifiedData = {
      media,
      files,
      voices,
      links,
      userTo,
      isBlocked,
    };

    return res.status(200).send(modifiedData);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const groupSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (query === "") return res.status(200).send([]);

    const group = await groups.find(
      {
        "groupDetails.name": { $regex: query, $options: "i" },
      },
      { _id: 1, groupDetails: 1, groupMembers: 1, groupSetting: 1 }
    );

    const filetedGroup = group.filter(
      (group) => group.groupSetting.private === false
    );

    return res.status(200).send(filetedGroup);
  } catch (Err) {
    return res.status(406).send(Err?.message);
  }
};

const groupJoin = async (req, res) => {
  const { userId } = req;
  const { groupId } = req.body;

  try {
    const group = await groups.findById({ _id: groupId });

    if (group.createdBy.toString() === userId) {
      return res.status(406).send("You can't join your own group");
    }

    if (group.groupMembers.includes(userId)) {
      return res.status(406).send("Already joined");
    }

    await groups.findOneAndUpdate(
      {
        _id: groupId,
      },
      {
        $push: {
          groupMembers: userId,
        },
      }
    );

    return res.status(200).send("Joined");
  } catch (Err) {
    return res.status(406).send(Err?.message);
  }
};

const groupCreate = async (req, res) => {
  const { userId } = req;
  const upload = multer().any();

  upload(req, res, async (err) => {
    try {
      const { groupDetails, groupMembers } = req.body;
      const { files } = req;

      const group = await groups.create({
        groupDetails,
        groupMembers,
        createdBy: userId,
      });

      fs.mkdirSync(
        `src/data/group-${group._id}`,
        { recursive: true },
        (err) => {
          if (err) console.log(err);
        }
      );

      exec(
        `cd src/data/group-${group._id} && mkdir audios files images videos recordings`
      );

      const filepathWithNewName = path.join(
        __dirname,
        `../data/group-${group._id}`,
        "Avatar.jpg"
      );

      fs.writeFile(filepathWithNewName, files[0].buffer, (err) => {
        if (err) console.log(err);
      });

      return res.status(200).send({ success: true });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(406).send("Group with same name exists");
      }
    }
  });
};

const groupUpdate = async (req, res) => {
  const { userId } = req;
  const { groupId, update } = req.body;

  const isEditable = await groups.findOne({ _id: groupId, createdBy: userId });
  if (!isEditable?._id) return res.status(403).send("you can't edit");

  if (update.operation === "addMember") {
    const group = await groups.findById({ _id: groupId });
    group.groupMembers.push(update.data);
    group.save();
    return res.status(200).send({ message: "Member added" });
  }

  if (update.operation === "deleteMember") {
    const group = await groups.findById({ _id: groupId });
    group.groupMembers = group.groupMembers.filter(
      (member) => member.toString() !== update.data
    );
    group.save();
    return res.status(200).send({ message: "Member deleted" });
  }
};

const groupClearChat = async (req, res) => {
  const { userId } = req;
  const { groupId } = req.body;

  try {
    const group = await groups.findById({ _id: groupId });
    if (group.createdBy.toString() === userId) {
      await groups.findOneAndUpdate(
        {
          _id: groupId,
        },
        {
          $set: {
            messages: [],
          },
        }
      );
      exec(
        `cd src/data/group-${groupId} && rm -rf audios files images videos recordings`
      );

      group.groupMembers.map(async (member) => {
        const user = await User.findById(member.toString());
        console.log(user.id);

        user.files = user.files.filter((file) => file.id != groupId);
        await user.save();
      });

      return res.status(200).send({ success: true });
    } else {
      return res.status(406).send("You can't clear chat");
    }
  } catch (error) {
    return res.status(406).send(error);
  }
};

const groupDelete = async (req, res) => {
  const { userId } = req;
  const { groupId } = req.body;
  try {
    const group = await groups.findById({ _id: groupId });
    if (group.createdBy.toString() === userId) {
      await groups.findByIdAndDelete({ _id: groupId });
      exec(`cd src/data && rm -rf group-${groupId}`);
      return res.status(200).send({ success: true });
    } else {
      return res.status(406).send("You can't delete this group");
    }
  } catch (error) {
    return res.status(406).send(error);
  }
};

const groupExit = async (req, res) => {
  const { userId } = req;

  try {
    const { groupId } = req.body;
    const group = await groups.findById({ _id: groupId });
    if (group.groupMembers.includes(userId)) {
      group.groupMembers = group.groupMembers.filter(
        (member) => member.toString() !== userId
      );
      await group.save();

      return res.status(200).send({ success: true });
    }
  } catch (error) {
    return res.status(406).send(error);
  }
};

const groupSettingUpdate = async (req, res) => {
  const upload = multer().any();

  upload(req, res, async (err) => {
    try {
      const { groupData, groupId } = req.body;
      const { files } = req;

      await groups.findOneAndUpdate(
        {
          _id: groupId,
        },
        {
          groupDetails: groupData.groupDetails,
          groupSetting: groupData.groupSetting,
        }
      );

      if (files[0]) {
        const filepathWithNewName = path.join(
          __dirname,
          `../data/group-${groupId}`,
          "Avatar.jpg"
        );

        fs.writeFile(filepathWithNewName, files[0].buffer, (err) => {
          if (err) console.log(err);
        });
      }

      return res.status(200).send(null);
    } catch (error) {
      console.log(error);
      return res.status(406).send("Error in server");
    }
  });
};

const groupList = async (req, res) => {
  const { userId } = req;
  try {
    const myGroups = await groups
      .find(
        { createdBy: userId },
        { groupDetails: 1, groupMembers: 1, avatar: 1, createdBy: 0 }
      )
      .populate({
        path: "createdBy",
        select:
          "fullName username avatarColor isAvatar status lastSeen profile.privacy.profilePhoto",
      });

    const imInGroups = await groups
      .find(
        {
          groupMembers: { $in: [userId] },
        },
        { groupDetails: 1, groupMembers: 1, avatar: 1, createdBy: 0 }
      )
      .populate({
        path: "createdBy",
        select:
          "fullName username avatarColor isAvatar status lastSeen profile.privacy.profilePhoto",
      });

    return res.status(200).send([...myGroups, ...imInGroups]);
  } catch (error) {
    return res
      .status(500)
      .send("Internal Server Error file in user.controller");
  }
};

const groupGetById = async (req, res) => {
  const { _id } = req.body;

  try {
    const group = await groups
      .findOne(
        { _id },
        {
          messages: 0,
          __v: 0,
        }
      )
      .populate({
        path: "createdBy",
        select:
          "fullName username avatarColor isAvatar status lastSeen profile.privacy.profilePhoto",
      });
    if (!group) {
      return res.status(404).send("Group not found");
    }
    return res.status(200).send({
      ...group.toObject(),
      groupMembersLength: group.groupMembers.length,
    });
  } catch (error) {
    return res
      .status(500)
      .send("Internal Server Error file in user.controller");
  }
};

const getGroupChatData = async (req, res) => {
  const { groupId } = req.body;

  try {
    const group = await groups.findById(groupId).populate({
      path: "createdBy groupMembers",
      select:
        "fullName username avatarColor isAvatar profile.privacy.profilePhoto",
    });

    var media = {
      images: [],
      videos: [],
      audios: [],
    };

    var files = [];
    var voices = [];

    group?.messages.map((msg) => {
      if (msg.message.file.type === "image") {
        media.images.push(
          `${config.server.host}/api/default/getMedia/group-${groupId}/images/${msg.message.file.name}`
        );
      }
      if (msg.message.file.type === "video") {
        media.videos.push(
          `${config.server.host}/api/default/getMedia/group-${groupId}/videos/${msg.message.file.name}`
        );
      }
      if (msg.message.file.type === "audio") {
        media.audios.push(
          `${config.server.host}/api/default/getMedia/group-${groupId}/audios/${msg.message.file.name}`
        );
      }
      if (msg.message.file.type === "file") {
        files.push({
          name: msg.message.file.name,
          url: `${config.server.host}/api/default/getMedia/group-${groupId}/files/${msg.message.file.name}`,
          size: msg.message.file.size,
          date: msg.timestamp,
          format: msg.message.file.name.split(".")[1],
        });
      }
      if (msg.message.file.type === "recording") {
        voices.push({
          name: msg.message.file.name,
          url: `${config.server.host}/api/default/getMedia/group-${groupId}/recordings/${msg.message.file.name}.mp3`,
          size: msg.message.file.size,
          date: msg.timestamp,
        });
      }
    });

    const links = group?.messages.flatMap((msg) =>
      msg.message.links.map((link) => link)
    );

    const modifiedData = {
      _id: group?._id,
      groupDetails: group?.groupDetails,
      groupMembers: group?.groupMembers,
      groupSetting: group?.groupSetting,
      createdBy: group?.createdBy,
      createdAt: group?.createdAt,
      media,
      files,
      voices,
      links,
    };

    return res.status(200).send(modifiedData);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const mediaStatus = async (req, res) => {
  const { userId } = req;
  const upload = multer().any();

  upload(req, res, async () => {
    try {
      const { media, caption } = req.body;
      const file = req.files;

      const fileName = `${Date.now()}-${media.name}`.replace(
        /[^a-zA-Z0-9.]+/g,
        "-"
      );

      const filepathWithNewName = path.join(
        __dirname,
        `../data/user-${userId}`,
        "status",
        fileName
      );

      fs.writeFile(filepathWithNewName, file[0].buffer, (err) => {
        console.log(err);
      });

      await User.findByIdAndUpdate(userId, {
        $push: {
          mediaStatus: {
            type: media.type,
            file: fileName,
            caption,
          },
        },
      });

      io.emit("status-refresh");

      return res.status(200).send("Status uploaded successfully");
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  });
};

const getMediaStatus = async (req, res) => {
  const { userId } = req;
  const { contacts } = req.body;
  const projection = {
    mediaStatus: 1,
    username: 1,
    fullName: 1,
    avatarColor: 1,
    isAvatar: 1,
    "profile.privacy.profilePhoto": 1,
    "profile.privacy.status": 1,
  };
  try {
    const contactStatus = await User.find(
      { _id: { $in: contacts } },
      projection
    );

    const myStatus = await User.findOne({ _id: userId }, projection);

    const AllStatus = [myStatus, ...contactStatus];

    if (AllStatus.length > 0) {
      const modifiedStatus = AllStatus.filter(
        (item) =>
          item.mediaStatus.length > 0 && item.profile.privacy.status != false
      );

      if (modifiedStatus.length > 0) {
        return res.status(200).send(modifiedStatus);
      } else {
        return res.status(200).send([]);
      }
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const deleteMediaStatus = async (req, res) => {
  const { userId } = req;
  const { index } = req.body;
  try {
    const user = await User.findById(userId);

    fs.unlinkSync(
      path.join(
        __dirname,
        `../data/user-${user._id}/status/${user.mediaStatus[index].file}`
      ),
      { recursive: true }
    );

    user.mediaStatus = user.mediaStatus.filter((item, i) => {
      if (i !== index) {
        return item;
      }
    });

    await user.save();

    return res.status(200).send("Status deleted successfully");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

const autoDeleteMediaStatus = async () => {
  const now = new Date();
  // const expirationTime = 1 * 1000;
  const expirationTime = 24 * 60 * 60 * 1000;
  try {
    const users = await User.find({
      "mediaStatus.createdAt": { $lte: new Date(now - expirationTime) },
    });

    users.map(async (user) => {
      user.mediaStatus.some((item) => {
        const filePath = path.join(
          __dirname + `../data/user-${user._id}/status/${item.file}`
        );

        fs.existsSync(filePath) && fs.unlinkSync(filePath, { recursive: true });
      });

      user.mediaStatus = user.mediaStatus.filter(
        (item) => now - item.createdAt < expirationTime
      );
      // console.log(user.mediaStatus);

      await user.save();
      console.log(`Deleted status for user ${user._id}`);
      io.to(user.socketId).emit("status-refresh");
    });
  } catch (error) {
    console.log("Error cleaning up expired mediaStatus items:", error);
  }
};

export {
  groupList,
  groupJoin,
  getAllChat,
  clearChat,
  groupExit,
  groupCreate,
  groupDelete,
  getAllFiles,
  groupUpdate,
  mediaStatus,
  groupSearch,
  groupGetById,
  profileUpdate,
  groupClearChat,
  getMediaStatus,
  searchProfiles,
  getProfileData,
  getGroupChatData,
  getChatWithinData,
  toggleBlockContact,
  populateFavorite,
  deleteMediaStatus,
  groupSettingUpdate,
  autoDeleteMediaStatus,
  handleContactOperations,
};
