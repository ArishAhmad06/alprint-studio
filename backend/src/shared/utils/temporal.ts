import { Temporal } from "@js-temporal/polyfill";

export const toInstant = (date: Date): Temporal.Instant =>
  Temporal.Instant.fromEpochMilliseconds(date.getTime());

export const fromInstant = (instant: Temporal.Instant): Date =>
  new Date(instant.epochMilliseconds);