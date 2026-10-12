import { AuthRepository } from "../../modules/auth/auth.repository.js";
import { AuthService } from "../../modules/auth/auth.service.js";

import { CategoryRepository } from "../../modules/category/category.repository.js";
import { CategoryService } from "../../modules/category/category.service.js";

import { ProductRepository } from "../../modules/product/product.repository.js";
import { ProductService } from "../../modules/product/product.service.js";

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
const productRepository = new ProductRepository();

export const authService = new AuthService(authRepository, createOtpProvider());
export const categoryService = new CategoryService(categoryRepository);
export const productService = new ProductService(
  productRepository,
  categoryRepository,
);
