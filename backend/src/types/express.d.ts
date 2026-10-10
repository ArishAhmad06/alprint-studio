declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string;
        sessionId: string;
        role: "CUSTOMER" | "OWNER";
      };
    }
  }
}

export {};