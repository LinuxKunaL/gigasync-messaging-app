import { Router } from "express";
import {
  me,
  login,
  register,
  verifyDashboard,
} from "../controller/auth.controller.js";

const router = Router();

router.post("/me", me);
router.post("/login", login);
router.post("/register", register);
router.post("/verifyDashboard", verifyDashboard);

export default router;
