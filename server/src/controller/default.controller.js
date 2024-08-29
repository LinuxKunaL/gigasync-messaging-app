import Express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const getMedia = Express.static(path.join(__dirname, "/../data"));

export { getMedia, getAvatar };
