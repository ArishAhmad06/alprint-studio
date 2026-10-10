import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may only contain lowercase letters, numbers and single hyphens",
  );

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters")
  .max(100, "Name cannot exceed 100 characters");

const descriptionSchema = z
  .string()
  .trim()
  .max(1000, "Description cannot exceed 1000 characters")
  .nullable();

const sortOrderSchema = z.number().int().min(0).max(100_000);

export const createCategorySchema = z.object({
  name: nameSchema,
  slug: slugSchema.optional(),
  description: descriptionSchema.optional(),
  parentId: z.uuid("parentId must be a valid id").nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  sortOrder: sortOrderSchema.default(0),
});

export const updateCategorySchema = z
  .object({
    name: nameSchema.optional(),
    slug: slugSchema.optional(),
    description: descriptionSchema.optional(),
    parentId: z.uuid("parentId must be a valid id").nullable().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
    sortOrder: sortOrderSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export const categoryIdParamSchema = z.object({
  id: z.uuid("id must be a valid id"),
});

export const categorySlugParamSchema = z.object({
  slug: slugSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;