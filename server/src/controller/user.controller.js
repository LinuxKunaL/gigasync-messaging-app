import { ChatModel, groups, User } from "../../database/model.js";
import { exec } from "child_process";
import fs from "fs";
import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import config from "../../config/config.js";

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
      select: "fullName username avatarColor isAvatar status lastSeen",
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

const getProfileData = async (req, res) => {
  const { _id } = req.body;
  const user = await User.findById(_id, {
    _id: 1,
    username: 1,
    fullName: 1,
    avatarColor: 1,
    isAvatar: 1,
    status: 1,
    lastSeen: 1,
  });
  return res.status(200).send(user);
};

const getAllChat = async (req, res) => {
  const { userId } = req;

  const { allChats } = await User.findOne(
    { _id: userId },
    {
      allChats: 1,
      _id: 0,
    }
  ).populate({
    path: "allChats",
    select: "fullName username avatarColor isAvatar",
  });

  const modifiedChats = await Promise.all(
    allChats.map(async (user) => {
      const getMessages = await ChatModel.findOne(
        {
          chatWithin: { $all: [user.id] },
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
      };
    })
  );

  if (allChats.length <= 0) {
    return res.status(404).send([]);
  }
  return res.status(200).send(modifiedChats);
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
    };

    chat?.messages.map((msg) => {
      if (msg.message.file.type === "image") {
        media.images.push(
          `http://localhost:1000/api/default/messageImage?messageId=${msg._id}&filename=${msg.message.file.name}&me=${msg.sender}`
        );
      }
      if (msg.message.file.type === "video") {
        media.videos.push(
          `http://localhost:1000/api/default/messageVideo/user-${msg.sender._id}/videos/${msg.message.file.name}`
        );
      }
    });

    const userTo = await User.findById(to, {
      _id: 1,
      username: 1,
      fullName: 1,
      avatarColor: 1,
      isAvatar: 1,
      profile: 1,
    });

    return res.status(200).send({ media, userTo });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
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
        `cd src/data/group-${group._id} && mkdir audios documents images videos recordings`
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
        select: "fullName username avatarColor isAvatar status lastSeen",
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
        select: "fullName username avatarColor isAvatar status lastSeen",
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
    const group = await groups.findOne({ _id }).populate({
      path: "createdBy",
      select: "fullName username avatarColor isAvatar status lastSeen",
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
      select: "fullName username avatarColor isAvatar",
    });

    var media = {
      images: [],
      videos: [],
    };

    group?.messages.map((msg) => {
      if (msg.message.file.type === "image") {
        media.images.push(
          `${config.server.host}/api/default/messageImage?filename=${msg.message.file.name}&_id=${groupId}&type=group`
        );
      }
      if (msg.message.file.type === "video") {
        media.videos.push(
          `${config.server.host}/api/default/messageVideo/group-${groupId}/videos/${msg.message.file.name}`
        );
      }
    });

    const modifiedData = {
      _id: group?._id,
      groupDetails: group?.groupDetails,
      groupMembers: group?.groupMembers,
      groupSetting: group?.groupSetting,
      createdBy: group?.createdBy,
      createdAt: group?.createdAt,
      media,
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

  upload(req, res, async (err) => {
    console.log(req.files);
    console.log(req.body);
  });
};

export {
  groupList,
  getAllChat,
  groupCreate,
  groupUpdate,
  mediaStatus,
  groupGetById,
  profileUpdate,
  searchProfiles,
  getProfileData,
  getGroupChatData,
  getChatWithinData,
  groupSettingUpdate,
  handleContactOperations,
};
