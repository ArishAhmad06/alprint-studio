import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// Compared against when the user doesn't exist, so response time doesn't reveal it.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", SALT_ROUNDS);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string | null,
): Promise<boolean> {
  const matches = await bcrypt.compare(password, passwordHash ?? DUMMY_HASH);

  return passwordHash !== null && matches;
}