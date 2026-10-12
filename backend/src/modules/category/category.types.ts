import type { Temporal } from "@js-temporal/polyfill";

export type CategoryStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  status: CategoryStatus;
  sortOrder: number;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
};

export type CreateCategoryData = {
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  status: CategoryStatus;
  sortOrder: number;
};

export type UpdateCategoryData = {
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | null | undefined;
  parentId?: string | null | undefined;
  status?: CategoryStatus | undefined;
  sortOrder?: number | undefined;
};

export type PublicCategoryDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
};

export type AdminCategoryDto = PublicCategoryDto & {
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};