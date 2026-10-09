import { z } from "zod";

const normalizePhone = (value: string): string => {
const cleaned = value.replace(/[\s-]/g, "");

return /^[6-9]\d{9}$/.test(cleaned) ? `+91${cleaned}` : cleaned;
};

const phoneSchema = z
.string()
.trim()
.transform(normalizePhone)
.refine(
(value) => /^\+[1-9]\d{9,14}$/.test(value),
"Enter a valid phone number",
);

const emailSchema = z
.string()
.trim()
.toLowerCase()
.email("Enter a valid email address");

export const signupSchema = z
.object({
name: z
.string()
.trim()
.min(2, "Name must contain at least 2 characters")
.max(100, "Name cannot exceed 100 characters"),
email: emailSchema.optional(),
phone: phoneSchema.optional(),
password: z
.string()
.min(8, "Password must contain at least 8 characters")
.max(128, "Password cannot exceed 128 characters"),
})
.refine((data) => Boolean(data.email) !== Boolean(data.phone), {
message: "Provide either email or phone, not both",
path: ["email"],
});

export const verifySignupOtpSchema = z.object({
identifier: z
.string()
.trim()
.min(1, "Email or phone is required")
.transform((value) =>
value.includes("@") ? value.toLowerCase() : normalizePhone(value),
)
.refine(
(value) =>
value.includes("@")
? z.string().email().safeParse(value).success
:/^\+[1-9]\d{9,14}$/.test(value),
"Enter a valid email or phone number",
),
otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const loginSchema = z
.object({
email: emailSchema.optional(),
phone: phoneSchema.optional(),
password: z.string().min(1, "Password is required"),
})
.refine((data) => Boolean(data.email) !== Boolean(data.phone), {
message: "Provide either email or phone, not both",
path: ["email"],
});

export const refreshTokenSchema = z.object({
refreshToken: z.string().min(1, "Refresh token is required"),
});

export const requestLoginOtpSchema = z
.object({
email: emailSchema.optional(),
phone: phoneSchema.optional(),
})
.refine((data) => Boolean(data.email) !== Boolean(data.phone), {
message: "Provide either email or phone, not both",
path: ["email"],
});

export const verifyLoginOtpSchema = z.object({
identifier: z
.string()
.trim()
.min(1, "Email or phone is required")
.transform((value) =>
value.includes("@") ? value.toLowerCase() : normalizePhone(value),
)
.refine(
(value) =>
value.includes("@")
? z.string().email().safeParse(value).success
:/^\+[1-9]\d{9,14}$/.test(value),
"Enter a valid email or phone number",
),
otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});
