import { ChatModel, User } from "../../database/model.js";

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

    chat.messages.map((msg) => {
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
    return res.status(500).send("Internal Server Error");
  }
};

export {
  getAllChat,
  profileUpdate,
  searchProfiles,
  getProfileData,
  getChatWithinData,
  handleContactOperations,
};
