import { Router } from "express";
import {
  getAvatar,
  linksPreview,
  getChatImage,
  getChatVideo,
} from "../controller/default.controller.js";

const router = Router();

router.post("/getLinksPreview", linksPreview);
router.use("/avatar", getAvatar);
router.use("/messageImage", getChatImage);
router.use("/messageVideo", getChatVideo);

export default router;
