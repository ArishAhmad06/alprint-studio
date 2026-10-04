export type AuthIdentifier =
  | {
      type: "email";
      value: string;
    }
  | {
      type: "phone";
      value: string;
    };

    export type OtpPurpose =
  | 'SIGNUP'
  | 'LOGIN'
  | 'PASSWORD_RESET';
