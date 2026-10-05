export type AuthIdentifier =
  | {
      type: "email";
      value: string;
    }
  | {
      type: "phone";
      value: string;
    };

export type OtpPurpose = "SIGNUP" | "LOGIN" | "PASSWORD_RESET";

export type UserRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  passwordHash: string | null;
  role: "CUSTOMER" | "OWNER";
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
};
