import { AuthRepository } from "../../modules/auth/auth.repository.js";
import { AuthService } from "../../modules/auth/auth.service.js";
import { DevOtpProvider } from "../otp/dev-otp.provider.js";

const authRepository = new AuthRepository();
const optProvider = new DevOtpProvider();

export const authService = new AuthService(authRepository, optProvider);
