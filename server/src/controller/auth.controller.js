import jwt from "jsonwebtoken";
import config from "../../config/config.js";

import { User } from "../../database/model.js";
import { exec } from "child_process";

const me = async (req, res) => {
  const { userId } = req;
  try {
    if (!userId) return res.status(401).send("Unauthorized");

    const user = await User.findById(userId, { password: 0, __v: 0 });

    if (!user) return res.status(401).send("User not found");

    return res.status(200).send(user);
  } catch (error) {
    res.status(404).send("Error in me function");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, password: password });

    if (!user) return res.status(400).send("Invalid email or password");

    if (user) {
      const jwtToken = jwt.sign({ _id: user._id }, config.jwt.key, {
        expiresIn: config.jwt.expiresIn,
      });
      return res.status(200).send({ success: true, token: jwtToken });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const register = async (req, res) => {
  const isEmail = await User.findOne({ email: req.body.email });

  try {
    if (!isEmail) {
      const isUsername = await User.findOne({ username: req.body.username });
      if (!isUsername) {
        const user = await User.create(req.body);
        exec(`mkdir src/data/user-${user._id}`, (err, stdout, stderr) => {
          if (err) console.log(err);
          exec(
            `cd src/data/user-${user._id} && mkdir audios documents images videos recordings`
          );
        });
        return res.send("User created successfully");
      } else {
        return res.status(400).send("Username already exists");
      }
    } else {
      return res.status(400).send("Email already exists");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const verifyDashboard = (req, res) => {
  const { userId } = req;
  User.findById(userId).then((user) => {
    if (!user) return res.status(401).send("Not Found");
    return res.status(200).send({ success: true });
  });
};

export { register, login, me, verifyDashboard };
