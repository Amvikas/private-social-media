import express from "express";
import { getMe,signup,login,logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/me",protectRoute,getMe);
router.post("/signup",signup);
router.post("/login",login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout",logout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;