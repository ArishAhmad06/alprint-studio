import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();

const authController = new AuthController();

router.route("/signup").post(authController.signup);

router.route("/signup/verify").post(authController.verifySignupOtp);

router.route("/login").post(authController.login);

export default router;
