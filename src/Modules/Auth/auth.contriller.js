import { Router } from "express";
import * as auth from "./auth.service.js";
import cookieParser from "cookie-parser";
const router = Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh", cookieParser(), auth.refresh);
router.post("/google-signup", auth.googleSignUp);
router.post("/google-login", auth.googlelogin);
router.post("/verify-code", auth.verifyCode);
router.post("/verify-account", auth.verifyAccount);
router.post("/forget-password", auth.forgetPassword);
router.post("/reset-password", auth.resetPassword);

export default router;
