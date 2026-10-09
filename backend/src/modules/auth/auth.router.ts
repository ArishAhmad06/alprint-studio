import { Router } from "express";

import { AuthController } from "./auth.controller.js";
import {
  signupSchema,
  verifySignupOtpSchema,
  loginSchema,
  requestLoginOtpSchema,
  verifyLoginOtpSchema,
  refreshTokenSchema,
} from "./auth.schema.js";
import { validateBody } from "../../common/http/middlewares/validate.middleware.js";
import { authenticate } from "../../common/http/middlewares/auth.middleware.js";

const router = Router();
const authController = new AuthController();

router.post("/signup", validateBody(signupSchema), authController.signup);
router.post(
  "/signup/verify",
  validateBody(verifySignupOtpSchema),
  authController.verifySignupOtp,
);

router.post("/login", validateBody(loginSchema), authController.login);
router.post(
  "/login/otp",
  validateBody(requestLoginOtpSchema),
  authController.requestLoginOtp,
);
router.post(
  "/login/otp/verify",
  validateBody(verifyLoginOtpSchema),
  authController.verifyLoginOtp,
);

router.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  authController.refresh,
);
router.post("/logout", authenticate, authController.logout);

export default router;
