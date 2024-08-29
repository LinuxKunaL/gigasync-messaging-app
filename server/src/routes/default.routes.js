import { Router } from "express";
import { getMedia, getAvatar } from "../controller/default.controller.js";

const router = Router();

router.use("/avatar", getAvatar);
router.use("/getMedia", getMedia);

export default router;
