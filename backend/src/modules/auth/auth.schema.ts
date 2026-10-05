import { z } from "zod";

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Min 2 character required")
      .max(100, "Max 100 characters allowed"),
    email: z.string().trim().email().optional(),
    phone: z
      .string()
      .trim()
      .min(10, "min 10 digits required")
      .max(15, "Max 15 characters allowed")
      .optional(),
    password: z.string().min(6).max(128),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Email or phone is required",
    path: ["email"],
  });
