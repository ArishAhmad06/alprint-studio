import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();

const authController = new AuthController();
  
router.route("/signup").post(authController.signup);

export default router;
