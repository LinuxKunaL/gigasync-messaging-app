import axios from "axios";
import Express from "express";
import fs from "fs";
import { DOMParser } from "linkedom";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const linksPreview = async (req, res) => {
  const links = req.body;

  if (!Array.isArray(links)) {
    return res.status(400).send("Invalid input, expected an array of links");
  }

  try {
    const previews = await Promise.all(
      links.map(async (link) => {
        const response = await axios.get(link);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");
        return { link, title: doc.title };
      })
    );
    res.send(previews);
  } catch (error) {
    res.status(500).send("Error fetching link previews");
  }
};

const getAvatar = async (req, res) => {
  const { id, type } = req.query;

  if (!id) return res.status(400).send("Invalid input, expected an id");

  try {
    const AvatarImage = path.join(
      __dirname,
      `../data/${type}-${id}/Avatar.jpg`
    );

    if (!fs.existsSync(AvatarImage)) {
      return res.status(404).send("Not Found");
    }

    return res.sendFile(AvatarImage);
  } catch (error) {
    console.log(error);
  }
};

const getChatImage = (req, res) => {
  const { messageId, filename, me } = req.query;

  const chatImage = path.join(
    __dirname,
    `../data/user-${me}/images/${filename}`
  );

  if (!fs.existsSync(chatImage)) {
    return res.status(404).send("Not Found");
  }

  if (fs.existsSync(chatImage)) {
    return res.sendFile(chatImage);
  }
};

const getChatVideo = Express.static(path.join(__dirname, "/../data"));

export { linksPreview, getAvatar, getChatImage, getChatVideo };
