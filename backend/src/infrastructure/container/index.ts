import { AuthRepository } from "../../modules/auth/auth.repository.js";
import { AuthService } from "../../modules/auth/auth.service.js";
import { CategoryRepository } from "../../modules/catalog/category.repository.js";
import { CategoryService } from "../../modules/catalog/category.service.js";
import { DevOtpProvider } from "../otp/dev-otp.provider.js";
import type { IOtpProvider } from "../otp/otp.provider.js";
import { env } from "../../config/env.js";

function createOtpProvider(): IOtpProvider {
  if (env.NODE_ENV === "production") {
    throw new Error(
      "No production OTP provider configured. Add an SMS/email provider before deploying.",
    );
  }
  return new DevOtpProvider();
}

const authRepository = new AuthRepository();
const categoryRepository = new CategoryRepository();

export const authService = new AuthService(authRepository, createOtpProvider());
export const categoryService = new CategoryService(categoryRepository);