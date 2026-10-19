import { AppError } from "../../common/http/errors/app-error.js";
import { slugify } from "../../shared/utils/slug.js";
import { isUniqueViolation } from "../../shared/utils/db-errors.js";

import type { ICategoryRepository } from "../category/category.repository.interface.js";
import type { IProductRepository } from "./product.repository.interface.js";
import type { CategoryRecord } from "../category/category.types.js";
import type {
  AdminProductListQuery,
  CreateProductInput,
  CreateVariantInput,
  PublicProductListQuery,
  UpdateProductInput,
  UpdateVariantInput,
} from "./product.schema.js";

import type {
  AdminProductDetailDto,
  AdminProductListItemDto,
  AdminVariantDto,
  CategoryRefDto,
  PaginationMeta,
  ProductStatus,
  ProductWithRelations,
  PublicProductDetailDto,
  PublicProductListItemDto,
  PublicVariantDto,
  UpdateProductData,
  UpdateVariantData,
  VariantRecord,
} from "./product.types.js";

const ALL_STATUSES: ProductStatus[] = [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
  "ARCHIVED",
];

// ---------- errors ----------

const productNotFound = () =>
  new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");

const variantNotFound = () =>
  new AppError(404, "VARIANT_NOT_FOUND", "Variant not found");

const slugTaken = () =>
  new AppError(
    409,
    "PRODUCT_SLUG_TAKEN",
    "A product with this slug already exists",
  );

const skuTaken = (sku: string) =>
  new AppError(409, "SKU_TAKEN", `SKU ${sku} is already in use`);

const duplicateValue = () =>
  new AppError(409, "DUPLICATE_VALUE", "The slug or SKU is already in use");

// ---------- mapping ----------

const activeVariants = (variants: VariantRecord[]) =>
  variants.filter((variant) => variant.isActive);

const priceFrom = (variants: VariantRecord[]): string | null => {
  const active = activeVariants(variants);

  if (active.length === 0) {
    return null;
  }

  return active.reduce((lowest, variant) =>
    Number(variant.price) < Number(lowest.price) ? variant : lowest,
  ).price;
};

const toPublicVariant = (variant: VariantRecord): PublicVariantDto => ({
  id: variant.id,
  sku: variant.sku,
  name: variant.name,
  price: variant.price,
  compareAtPrice: variant.compareAtPrice,
  weight: variant.weight,
  sortOrder: variant.sortOrder,
});

const toAdminVariant = (variant: VariantRecord): AdminVariantDto => ({
  ...toPublicVariant(variant),
  isActive: variant.isActive,
  createdAt: variant.createdAt.toString(),
  updatedAt: variant.updatedAt.toString(),
});

const categoryRefs = (
  ids: string[],
  categories: Map<string, CategoryRecord>,
  onlyActive: boolean,
): CategoryRefDto[] =>
  ids
    .map((id) => categories.get(id))
    .filter(
      (category): category is CategoryRecord =>
        category !== undefined && (!onlyActive || category.status === "ACTIVE"),
    )
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));

const toPublicListItem = (
  product: ProductWithRelations,
  categories: Map<string, CategoryRecord>,
): PublicProductListItemDto => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  isCustomizable: product.isCustomizable,
  priceFrom: priceFrom(product.variants),
  variantCount: activeVariants(product.variants).length,
  categories: categoryRefs(product.categoryIds, categories, true),
});

const toAdminListItem = (
  product: ProductWithRelations,
  categories: Map<string, CategoryRecord>,
): AdminProductListItemDto => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  status: product.status,
  isCustomizable: product.isCustomizable,
  sortOrder: product.sortOrder,
  priceFrom: priceFrom(product.variants),
  variantCount: product.variants.length,
  activeVariantCount: activeVariants(product.variants).length,
  categories: categoryRefs(product.categoryIds, categories, false),
  createdAt: product.createdAt.toString(),
  updatedAt: product.updatedAt.toString(),
});

const buildMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export class ProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  // ---------- public ----------

  async listPublic(query: PublicProductListQuery) {
    let categoryIds: string[] | undefined;

    if (query.category) {
      const category = await this.categoryRepository.findBySlug(query.category);

      if (!category || category.status !== "ACTIVE") {
        throw new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");
      }

      // A parent category also lists the products of its active sub-categories.
      categoryIds = await this.collectActiveSubtreeIds(category.id);
    }

    const { items, total } = await this.productRepository.listProducts({
      statuses: ["ACTIVE"],
      search: query.q,
      categoryIds,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });

    const categories = await this.loadCategories(
      items.flatMap((item) => item.categoryIds),
    );

    return {
      items: items.map((item) => toPublicListItem(item, categories)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  async getPublicBySlug(slug: string): Promise<PublicProductDetailDto> {
    const product = await this.productRepository.findProductBySlug(slug);

    if (!product || product.status !== "ACTIVE") {
      throw productNotFound();
    }

    const categories = await this.loadCategories(product.categoryIds);

    return {
      ...toPublicListItem(product, categories),
      variants: activeVariants(product.variants).map(toPublicVariant),
    };
  }

  // ---------- owner: products ----------

  async listAdmin(query: AdminProductListQuery) {
    const { items, total } = await this.productRepository.listProducts({
      statuses: query.status ? [query.status] : ALL_STATUSES,
      search: query.q,
      categoryIds: query.categoryId ? [query.categoryId] : undefined,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    });

    const categories = await this.loadCategories(
      items.flatMap((item) => item.categoryIds),
    );

    return {
      items: items.map((item) => toAdminListItem(item, categories)),
      meta: buildMeta(total, query.page, query.limit),
    };
  }

  async getAdminById(id: string): Promise<AdminProductDetailDto> {
    const product = await this.productRepository.findProductById(id);

    if (!product) {
      throw productNotFound();
    }

    return this.toAdminDetail(product);
  }

  async create(input: CreateProductInput): Promise<AdminProductDetailDto> {
    const slug = input.slug ?? slugify(input.name);

    if (!slug) {
      throw new AppError(
        400,
        "INVALID_SLUG",
        "Could not build a slug from the name, please provide one",
      );
    }

    if (await this.productRepository.findProductBySlug(slug)) {
      throw slugTaken();
    }

    await this.assertCategoriesUsable(input.categoryIds);

    for (const variant of input.variants) {
      if (await this.productRepository.findVariantBySku(variant.sku)) {
        throw skuTaken(variant.sku);
      }
    }

    try {
      const created = await this.productRepository.createProduct({
        name: input.name,
        slug,
        description: input.description ?? null,
        status: input.status,
        isCustomizable: input.isCustomizable,
        sortOrder: input.sortOrder,
        categoryIds: input.categoryIds,
        variants: input.variants.map((variant) => ({
          sku: variant.sku,
          name: variant.name ?? null,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice ?? null,
          weight: variant.weight ?? null,
          isActive: variant.isActive,
          sortOrder: variant.sortOrder,
        })),
      });

      return this.toAdminDetail(created);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw duplicateValue();
      }
      throw error;
    }
  }

  async update(
    id: string,
    input: UpdateProductInput,
  ): Promise<AdminProductDetailDto> {
    const existing = await this.productRepository.findProductById(id);

    if (!existing) {
      throw productNotFound();
    }

    if (input.slug !== undefined && input.slug !== existing.slug) {
      if (await this.productRepository.findProductBySlug(input.slug)) {
        throw slugTaken();
      }
    }

    if (input.categoryIds) {
      await this.assertCategoriesUsable(input.categoryIds);
    }

    if (input.status === "ACTIVE" && existing.status !== "ACTIVE") {
      this.assertHasActiveVariant(existing);
    }

    const patch: UpdateProductData = { ...input };

    try {
      const updated = await this.productRepository.updateProduct(id, patch);

      if (!updated) {
        throw productNotFound();
      }
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw duplicateValue();
      }
      throw error;
    }

    return this.getAdminById(id);
  }

  // "Deleting" archives the product so past orders keep their history.
  async archive(id: string): Promise<AdminProductDetailDto> {
    const existing = await this.productRepository.findProductById(id);

    if (!existing) {
      throw productNotFound();
    }

    if (existing.status !== "ARCHIVED") {
      await this.productRepository.updateProduct(id, { status: "ARCHIVED" });
    }

    return this.getAdminById(id);
  }

  // ---------- owner: variants ----------

  async addVariant(
    productId: string,
    input: CreateVariantInput,
  ): Promise<AdminVariantDto> {
    const product = await this.productRepository.findProductById(productId);

    if (!product) {
      throw productNotFound();
    }

    if (product.status === "ARCHIVED") {
      throw new AppError(
        409,
        "PRODUCT_ARCHIVED",
        "Cannot add variants to an archived product",
      );
    }

    if (await this.productRepository.findVariantBySku(input.sku)) {
      throw skuTaken(input.sku);
    }

    try {
      const variant = await this.productRepository.createVariant(productId, {
        sku: input.sku,
        name: input.name ?? null,
        price: input.price,
        compareAtPrice: input.compareAtPrice ?? null,
        weight: input.weight ?? null,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      });

      return toAdminVariant(variant);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw skuTaken(input.sku);
      }
      throw error;
    }
  }

  async updateVariant(
    productId: string,
    variantId: string,
    input: UpdateVariantInput,
  ): Promise<AdminVariantDto> {
    const product = await this.productRepository.findProductById(productId);

    if (!product) {
      throw productNotFound();
    }

    const variant = product.variants.find((item) => item.id === variantId);

    if (!variant) {
      throw variantNotFound();
    }

    if (input.sku !== undefined && input.sku !== variant.sku) {
      if (await this.productRepository.findVariantBySku(input.sku)) {
        throw skuTaken(input.sku);
      }
    }

    // The request schema only compares fields sent together, so also compare
    // against what is already stored.
    const price = input.price ?? variant.price;
    const compareAtPrice =
      input.compareAtPrice !== undefined
        ? input.compareAtPrice
        : variant.compareAtPrice;

    if (compareAtPrice !== null && Number(compareAtPrice) <= Number(price)) {
      throw new AppError(
        400,
        "INVALID_COMPARE_AT_PRICE",
        "compareAtPrice must be greater than price",
      );
    }

    if (input.isActive === false && variant.isActive) {
      this.assertNotLastActiveVariant(product, variant.id);
    }

    const patch: UpdateVariantData = { ...input };

    try {
      const updated = await this.productRepository.updateVariant(
        variantId,
        patch,
      );

      if (!updated) {
        throw variantNotFound();
      }

      return toAdminVariant(updated);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw skuTaken(input.sku ?? variant.sku);
      }
      throw error;
    }
  }

  // Variants are deactivated, not deleted, so past orders can still point at them.
  async deactivateVariant(
    productId: string,
    variantId: string,
  ): Promise<AdminVariantDto> {
    return this.updateVariant(productId, variantId, { isActive: false });
  }

  // ---------- helpers ----------

  private async toAdminDetail(
    product: ProductWithRelations,
  ): Promise<AdminProductDetailDto> {
    const categories = await this.loadCategories(product.categoryIds);

    return {
      ...toAdminListItem(product, categories),
      description: product.description,
      variants: product.variants.map(toAdminVariant),
    };
  }

  private async loadCategories(
    ids: string[],
  ): Promise<Map<string, CategoryRecord>> {
    const unique = [...new Set(ids)];
    const categories = await this.categoryRepository.findByIds(unique);

    return new Map(categories.map((category) => [category.id, category]));
  }

  private async collectActiveSubtreeIds(rootId: string): Promise<string[]> {
    const ids = [rootId];
    const seen = new Set(ids);
    const queue = [rootId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = await this.categoryRepository.listChildren(current);

      for (const child of children) {
        if (child.status === "ACTIVE" && !seen.has(child.id)) {
          seen.add(child.id);
          ids.push(child.id);
          queue.push(child.id);
        }
      }
    }

    return ids;
  }

  private async assertCategoriesUsable(categoryIds: string[]): Promise<void> {
    if (categoryIds.length === 0) {
      return;
    }

    const found = await this.categoryRepository.findByIds(categoryIds);
    const byId = new Map(found.map((category) => [category.id, category]));

    const missing = categoryIds.filter((id) => !byId.has(id));

    if (missing.length > 0) {
      throw new AppError(
        400,
        "CATEGORY_NOT_FOUND",
        `Category not found: ${missing.join(", ")}`,
      );
    }

    if (found.some((category) => category.status === "ARCHIVED")) {
      throw new AppError(
        400,
        "CATEGORY_ARCHIVED",
        "Cannot assign a product to an archived category",
      );
    }
  }

  private assertHasActiveVariant(product: ProductWithRelations): void {
    if (activeVariants(product.variants).length === 0) {
      throw new AppError(
        409,
        "PRODUCT_HAS_NO_ACTIVE_VARIANT",
        "Add at least one active variant before activating this product",
      );
    }
  }

  private assertNotLastActiveVariant(
    product: ProductWithRelations,
    variantId: string,
  ): void {
    if (product.status !== "ACTIVE") {
      return;
    }

    const others = activeVariants(product.variants).filter(
      (variant) => variant.id !== variantId,
    );

    if (others.length === 0) {
      throw new AppError(
        409,
        "LAST_ACTIVE_VARIANT",
        "An active product needs at least one active variant. Deactivate the product first.",
      );
    }
  }
  
}