import { Router } from "express";
import {
  groupList,
  groupJoin,
  groupExit,
  getAllChat,
  groupDelete,
  clearChat,
  getAllFiles,
  groupCreate,
  mediaStatus,
  groupUpdate,
  groupSearch,
  groupGetById,
  profileUpdate,
  groupClearChat,
  getMediaStatus,
  searchProfiles,
  getProfileData,
  populateFavorite,
  getGroupChatData,
  getChatWithinData,
  deleteMediaStatus,
  groupSettingUpdate,
  handleContactOperations,
  toggleBlockContact,
} from "../controller/user.controller.js";
import { upload } from "../utils/storage.js";

const router = Router();

router.post("/group/list", groupList);
router.post("/group/create", groupCreate);
router.post("/group/getById", groupGetById);
router.post("/group/update", groupUpdate);
router.post("/group/search", groupSearch);
router.post("/group/join", groupJoin);
router.post("/group/updateSetting", groupSettingUpdate);
router.post("/group/delete", groupDelete);
router.post("/group/clearChat", groupClearChat);
router.post("/group/exit", groupExit);

router.post("/populateFavorite", populateFavorite);
router.post("/clearChat", clearChat);

router.post("/setMediaStatus", mediaStatus);
router.post("/getMediaStatus", getMediaStatus);
router.post("/deleteMediaStatus", deleteMediaStatus);

router.post("/profile/search", searchProfiles);
router.post("/profile/getById", getProfileData);

router.post("/getChatWithinData", getChatWithinData);
router.post("/getGroupChatData", getGroupChatData);
router.post("/updateProfile", upload.any("avatar"), profileUpdate);
router.post("/blockContact",  toggleBlockContact);
router.use("/contact", handleContactOperations);
router.get("/allChats", getAllChat);
router.get("/allFiles", getAllFiles);
export default router;
