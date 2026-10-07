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
}
