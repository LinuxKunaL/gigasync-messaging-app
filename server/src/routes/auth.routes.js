import { Router } from "express";
import {
  me,
  login,
  register,
  otpVerify,
  forgotPassword,
  changePassword,
  verifyDashboard,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/me", me);
router.post("/login", login);
router.post("/register", register);
router.post("/verifyDashboard", verifyDashboard);
router.post("/forgotPassword/requestOtp", forgotPassword);
router.post("/forgotPassword/verifyOtp", otpVerify);
router.post("/forgotPassword/change", changePassword);

export default router;
