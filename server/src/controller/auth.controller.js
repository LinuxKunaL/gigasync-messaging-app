import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import fs from "fs";

import { Otp, User } from "../../database/model.js";
import { exec } from "child_process";
import { sendGoogleMail } from "../utils/EmailSend.js";

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

        if (!fs.existsSync(`/server/src/data`)) {
          exec("mkdir src/data");
        }

        exec(`mkdir src/data/user-${user._id}`, (err, stdout, stderr) => {
          if (err) console.log(err);
          exec(
            `cd src/data/user-${user._id} && mkdir audios status files images videos recordings`
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then(async (user) => {
    if (!user) return res.status(401).send("Email Not Found");
    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.create({
      email: email,
      otp,
    });
    sendGoogleMail(email, otp);
    return res.status(200).send({ success: true });
  });
};

const otpVerify = async (req, res) => {
  const { email, otp } = req.body;
  Otp.findOne({ email: email, otp: otp }).then(async (user) => {
    if (!user) return res.status(401).send("Invalid OTP");
    await Otp.deleteMany({ email: email });
    return res.status(200).send({ success: true });
  });
};

const changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  User.findOne({ email: email }).then((user) => {
    user.password = newPassword;
    user.save();
    return res.status(200).send({ success: true });
  });
};

const verifyDashboard = (req, res) => {
  const { userId } = req;
  User.findById(userId).then((user) => {
    if (!user) return res.status(401).send("Not Found");
    return res.status(200).send({ success: true });
  });
};

export {
  me,
  login,
  register,
  otpVerify,
  changePassword,
  forgotPassword,
  verifyDashboard,
};
