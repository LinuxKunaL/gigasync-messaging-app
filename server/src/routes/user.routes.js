import { Router } from "express";
import {
  getAllChat,
  profileUpdate,
  searchProfiles,
  getProfileData,
  handleContactOperations,
  getChatWithinData,
} from "../controller/user.controller.js";
import { upload } from "../utils/storage.js";

const router = Router();

router.post("/updateProfile", upload.any("avatar"), profileUpdate);
router.use("/contact", handleContactOperations);
router.post("/profile/search", searchProfiles);
router.post("/profile/getById", getProfileData);
router.post("/getChatWithinData", getChatWithinData);
router.get("/allChats", getAllChat);

export default router;
