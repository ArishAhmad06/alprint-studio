import type { Request, Response } from "express";
import { authService } from "../../infrastructure/container/index.js";

export class AuthController {
  signup = async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);

    return res.status(201).json({
      success: true,
      data: result,
    });
  };

  verifySignupOtp = async (req: Request, res: Response) => {
    const result = await authService.verifySignupOtp(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  };

  //login controller
  login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  };

  refresh = async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  };

  logout = async (req: Request, res: Response) => {
    await authService.logout(req.auth.sessionId);

    return res.status(200).json({
      success: true,
      data: {
        message: "Logout successful",
      },
    });
  };
}
