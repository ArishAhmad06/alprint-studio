// Postgres reports unique-constraint violations with SQLSTATE 23505.
// The error may be wrapped, so follow `cause` a few levels.
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;

  for (let depth = 0; depth < 4; depth++) {
    if (typeof current !== "object" || current === null) {
      return false;
    }

    if ("code" in current && current.code === "23505") {
      return true;
    }

    current = "cause" in current ? current.cause : undefined;
  }

  return false;
}