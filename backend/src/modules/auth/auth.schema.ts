import { z } from "zod";

const normalizePhone = (value: string): string => {
  const cleaned = value.replace(/[\s-]/g, "");
  return /^[6-9]\d{9}$/.test(cleaned) ? `+91${cleaned}` : cleaned;
};

const phoneSchema = z
  .string()
  .trim()
  .transform(normalizePhone)
  .refine((v) => /^\+[1-9]\d{9,14}$/.test(v), "Enter a valid phone number");

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Min 2 character required")
      .max(100, "Max 100 characters allowed"),
    email: z.string().trim().toLowerCase().email().optional(),
    phone: phoneSchema.optional(),
    password: z.string().min(8).max(128),
  })
  .refine((data) => Boolean(data.email) !== Boolean(data.phone), {
    message: "Provide either email or phone, not both",
    path: ["email"],
  });

export const verifySignupOtpSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1)
    .transform((v) => (v.includes("@") ? v.toLowerCase() : normalizePhone(v))),
  otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});