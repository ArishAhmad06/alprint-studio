import type { Temporal } from "@js-temporal/polyfill";

export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type ProductSort = "featured" | "newest" | "name";

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProductStatus;
  isCustomizable: boolean;
  sortOrder: number;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
};

// Prices and weights are exact decimal strings, e.g. "199.50".
export type VariantRecord = {
  id: string;
  productId: string;
  sku: string;
  name: string | null;
  price: string;
  compareAtPrice: string | null;
  weight: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
};

export type ProductWithRelations = ProductRecord & {
  variants: VariantRecord[];
  categoryIds: string[];
};

export type ListProductsParams = {
  statuses: ProductStatus[];
  search?: string | undefined;
  categoryIds?: string[] | undefined;
  sort: ProductSort;
  page: number;
  limit: number;
};

export type NewVariantData = {
  sku: string;
  name: string | null;
  price: string;
  compareAtPrice: string | null;
  weight: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type UpdateVariantData = {
  sku?: string | undefined;
  name?: string | null | undefined;
  price?: string | undefined;
  compareAtPrice?: string | null | undefined;
  weight?: string | null | undefined;
  isActive?: boolean | undefined;
  sortOrder?: number | undefined;
};

export type CreateProductData = {
  name: string;
  slug: string;
  description: string | null;
  status: ProductStatus;
  isCustomizable: boolean;
  sortOrder: number;
  categoryIds: string[];
  variants: NewVariantData[];
};

export type UpdateProductData = {
  name?: string | undefined;
  slug?: string | undefined;
  description?: string | null | undefined;
  status?: ProductStatus | undefined;
  isCustomizable?: boolean | undefined;
  sortOrder?: number | undefined;
  categoryIds?: string[] | undefined;
};

export type CategoryRefDto = {
  id: string;
  name: string;
  slug: string;
};

export type PublicVariantDto = {
  id: string;
  sku: string;
  name: string | null;
  price: string;
  compareAtPrice: string | null;
  weight: string | null;
  sortOrder: number;
};

export type AdminVariantDto = PublicVariantDto & {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PublicProductListItemDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isCustomizable: boolean;
  priceFrom: string | null;
  variantCount: number;
  categories: CategoryRefDto[];
};

export type PublicProductDetailDto = PublicProductListItemDto & {
  variants: PublicVariantDto[];
};

export type AdminProductListItemDto = {
  id: string;
  name: string;
  slug: string;
  status: ProductStatus;
  isCustomizable: boolean;
  sortOrder: number;
  priceFrom: string | null;
  variantCount: number;
  activeVariantCount: number;
  categories: CategoryRefDto[];
  createdAt: string;
  updatedAt: string;
};

export type AdminProductDetailDto = AdminProductListItemDto & {
  description: string | null;
  variants: AdminVariantDto[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};