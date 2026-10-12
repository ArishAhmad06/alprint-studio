import { z } from "zod";

import { slugSchema } from "../../shared/schemas/slug.schema";

// ---------- decimals ----------
// Money and weight are accepted as strings or numbers and normalised to a
// fixed-scale string, so nothing is ever stored through floating point maths.

const decimalString = (maxIntegerDigits: number, scale: number) =>
  new RegExp(`^\\d{1,${maxIntegerDigits}}(\\.\\d{1,${scale}})?$`);

const decimalSchema = (maxIntegerDigits: number, scale: number) => {
  const pattern = decimalString(maxIntegerDigits, scale);
  const max = 10 ** maxIntegerDigits;

  return z
    .union([z.string().trim(), z.number()])
    .refine(
      (value) => {
        if (typeof value === "string") {
          return pattern.test(value);
        }

        const factor = 10 ** scale;
        return (
          Number.isFinite(value) &&
          value >= 0 &&
          value < max &&
          Math.abs(value * factor - Math.round(value * factor)) < 1e-6
        );
      },
      {
        message: `Must be a non-negative number with at most ${scale} decimal places`,
      },
    )
    .transform((value) => Number(value).toFixed(scale));
};

const priceSchema = decimalSchema(8, 2).refine((value) => Number(value) > 0, {
  message: "Price must be greater than 0",
});

const compareAtPriceSchema = decimalSchema(8, 2);
const weightSchema = decimalSchema(7, 3);

// ---------- shared fields ----------

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must contain at least 2 characters")
  .max(150, "Name cannot exceed 150 characters");

const descriptionSchema = z
  .string()
  .trim()
  .max(5000, "Description cannot exceed 5000 characters")
  .nullable();

const skuSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z0-9][A-Z0-9._-]{1,63}$/,
    "SKU must be 2-64 characters: letters, numbers, dot, underscore or hyphen",
  );

const sortOrderSchema = z.number().int().min(0).max(100_000);

const categoryIdsSchema = z
  .array(z.uuid("categoryIds must contain valid ids"))
  .max(20, "A product can belong to at most 20 categories")
  .refine((ids) => new Set(ids).size === ids.length, {
    message: "categoryIds must not contain duplicates",
  });

// ---------- variants ----------

const variantFields = {
  sku: skuSchema,
  name: z.string().trim().min(1).max(100).nullable(),
  price: priceSchema,
  compareAtPrice: compareAtPriceSchema.nullable(),
  weight: weightSchema.nullable(),
  isActive: z.boolean(),
  sortOrder: sortOrderSchema,
};

const compareAtIsHigher = (data: {
  price?: string | undefined;
  compareAtPrice?: string | null | undefined;
}) =>
  data.price === undefined ||
  data.compareAtPrice === undefined ||
  data.compareAtPrice === null ||
  Number(data.compareAtPrice) > Number(data.price);

const compareAtMessage = {
  message: "compareAtPrice must be greater than price",
  path: ["compareAtPrice"],
};

export const createVariantSchema = z
  .object({
    sku: variantFields.sku,
    name: variantFields.name.optional(),
    price: variantFields.price,
    compareAtPrice: variantFields.compareAtPrice.optional(),
    weight: variantFields.weight.optional(),
    isActive: variantFields.isActive.default(true),
    sortOrder: variantFields.sortOrder.default(0),
  })
  .refine(compareAtIsHigher, compareAtMessage);

export const updateVariantSchema = z
  .object({
    sku: variantFields.sku.optional(),
    name: variantFields.name.optional(),
    price: variantFields.price.optional(),
    compareAtPrice: variantFields.compareAtPrice.optional(),
    weight: variantFields.weight.optional(),
    isActive: variantFields.isActive.optional(),
    sortOrder: variantFields.sortOrder.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  })
  .refine(compareAtIsHigher, compareAtMessage);

// ---------- products ----------

export const createProductSchema = z
  .object({
    name: nameSchema,
    slug: slugSchema.optional(),
    description: descriptionSchema.optional(),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("DRAFT"),
    isCustomizable: z.boolean().default(false),
    sortOrder: sortOrderSchema.default(0),
    categoryIds: categoryIdsSchema.default([]),
    variants: z.array(createVariantSchema).max(50).default([]),
  })
  .refine(
    (data) => {
      const skus = data.variants.map((variant) => variant.sku);
      return new Set(skus).size === skus.length;
    },
    { message: "Variant SKUs must be unique", path: ["variants"] },
  )
  .refine(
    (data) =>
      data.status !== "ACTIVE" ||
      data.variants.some((variant) => variant.isActive),
    {
      message: "An active product needs at least one active variant",
      path: ["variants"],
    },
  );

export const updateProductSchema = z
  .object({
    name: nameSchema.optional(),
    slug: slugSchema.optional(),
    description: descriptionSchema.optional(),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
    isCustomizable: z.boolean().optional(),
    sortOrder: sortOrderSchema.optional(),
    categoryIds: categoryIdsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

// ---------- params and queries ----------

export const productIdParamSchema = z.object({
  id: z.uuid("id must be a valid id"),
});

export const productSlugParamSchema = z.object({
  slug: slugSchema,
});

export const variantParamsSchema = z.object({
  id: z.uuid("id must be a valid id"),
  variantId: z.uuid("variantId must be a valid id"),
});

const pageSchema = z.coerce.number().int().min(1).max(10_000).default(1);
const limitSchema = z.coerce.number().int().min(1).max(100).default(20);
const searchSchema = z.string().trim().min(1).max(100);
const sortSchema = z.enum(["featured", "newest", "name"]).default("featured");

export const publicProductListQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  q: searchSchema.optional(),
  category: slugSchema.optional(),
  sort: sortSchema,
});

export const adminProductListQuerySchema = z.object({
  page: pageSchema,
  limit: limitSchema,
  q: searchSchema.optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  categoryId: z.uuid("categoryId must be a valid id").optional(),
  sort: sortSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
export type PublicProductListQuery = z.infer<typeof publicProductListQuerySchema>;
export type AdminProductListQuery = z.infer<typeof adminProductListQuerySchema>;