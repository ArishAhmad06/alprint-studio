import "dotenv/config";

import { Temporal } from "@js-temporal/polyfill";

globalThis.Temporal = Temporal;

console.log("Temoporal available", typeof globalThis.Temporal);

const { default: postgres } = await import("@prisma/orm-postgres/runtime");

import type { Contract } from "./schema.js";

import contractJson from "./schema.json" with { type: "json" };

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});
