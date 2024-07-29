import { Router } from "express";
import {
  groupList,
  getAllChat,
  groupCreate,
  groupUpdate,
  groupGetById,
  profileUpdate,
  searchProfiles,
  getProfileData,
  getGroupChatData,
  getChatWithinData,
  groupSettingUpdate,
  handleContactOperations,
} from "../controller/user.controller.js";
import { upload } from "../utils/storage.js";

const router = Router();
router.post("/group/list", groupList);
router.post("/group/create", groupCreate);
router.post("/group/getById", groupGetById);
router.post("/group/update", groupUpdate);
router.post("/group/updateSetting", groupSettingUpdate);

router.post("/profile/search", searchProfiles);
router.post("/profile/getById", getProfileData);

router.post("/getChatWithinData", getChatWithinData);
router.post("/getGroupChatData", getGroupChatData);
router.post("/updateProfile", upload.any("avatar"), profileUpdate);
router.use("/contact", handleContactOperations);
router.get("/allChats", getAllChat);
export default router;
