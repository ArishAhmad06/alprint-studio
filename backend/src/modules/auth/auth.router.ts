import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "../../common/http/middlewares/auth.middleware.js";

const router = Router();
const authController = new AuthController();

router.route("/signup").post(authController.signup);
router.route("/signup/verify").post(authController.verifySignupOtp);
router.route("/login").post(authController.login);
router.route("/login/otp").post(authController.requestLoginOtp);
router.route("/login/otp/verify").post(authController.verifyLoginOtp);
router.route("/refresh").post(authController.refresh);
router.route("/logout").post(authenticate, authController.logout);
export default router;
