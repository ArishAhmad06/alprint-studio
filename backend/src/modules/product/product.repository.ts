import { and } from "@prisma/orm-postgres/orm-client";

import { db } from "../../prisma/db.js";
import type { Models } from "../../prisma/schema.js";

import type { IProductRepository } from "./product.repository.interface.js";
import type {
  CreateProductData,
  ListProductsParams,
  NewVariantData,
  ProductRecord,
  ProductWithRelations,
  UpdateProductData,
  UpdateVariantData,
  VariantRecord,
} from "./product.types.js";

// The database stores prices as branded NUMERIC strings; the schema layer has
// already normalised them to fixed-scale decimal strings.
type DbPrice = Models.public_ProductVariant["price"];
type DbCompareAt = Models.public_ProductVariant["compareAtPrice"];
type DbWeight = Models.public_ProductVariant["weight"];

const asPrice = (value: string) => value as DbPrice;
const asCompareAt = (value: string | null) => value as DbCompareAt;
const asWeight = (value: string | null) => value as DbWeight;

// Escape LIKE wildcards so user input is matched literally.
const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

type ProductRow = ProductRecord & {
  variants: VariantRecord[];
  categories: { categoryId: string }[];
};

const toProductWithRelations = (row: ProductRow): ProductWithRelations => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  status: row.status,
  isCustomizable: row.isCustomizable,
  sortOrder: row.sortOrder,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  variants: [...row.variants].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.sku.localeCompare(b.sku),
  ),
  categoryIds: row.categories.map((link) => link.categoryId),
});

export class ProductRepository implements IProductRepository {
  async listProducts(
    params: ListProductsParams,
  ): Promise<{ items: ProductWithRelations[]; total: number }> {
    const search = params.search ? `%${escapeLike(params.search)}%` : null;
    const categoryIds = params.categoryIds;

    const filtered = db.orm.public.Product.where((product) =>
      and(
        product.status.in(params.statuses),
        ...(search ? [product.name.ilike(search)] : []),
        ...(categoryIds
          ? [
              product.categories.some((link) =>
                link.categoryId.in(categoryIds),
              ),
            ]
          : []),
      ),
    );

    const aggregate = await filtered.aggregate((a) => ({ total: a.count() }));

    const ordered =
      params.sort === "newest"
        ? filtered.orderBy([
            (p) => p.createdAt.desc(),
            (p) => p.id.asc(),
          ])
        : params.sort === "name"
          ? filtered.orderBy([(p) => p.name.asc(), (p) => p.id.asc()])
          : filtered.orderBy([
              (p) => p.sortOrder.asc(),
              (p) => p.name.asc(),
              (p) => p.id.asc(),
            ]);

    const rows = await ordered
      .limit(params.limit)
      .offset((params.page - 1) * params.limit)
      .include("variants")
      .include("categories")
      .all();

    return {
      items: rows.map((row) => toProductWithRelations(row)),
      total: Number(aggregate.total),
    };
  }

  async findProductById(id: string): Promise<ProductWithRelations | null> {
    const row = await db.orm.public.Product.where({ id })
      .include("variants")
      .include("categories")
      .first();

    return row ? toProductWithRelations(row) : null;
  }

  async findProductBySlug(slug: string): Promise<ProductWithRelations | null> {
    const row = await db.orm.public.Product.where({ slug })
      .include("variants")
      .include("categories")
      .first();

    return row ? toProductWithRelations(row) : null;
  }

  async createProduct(data: CreateProductData): Promise<ProductWithRelations> {
    const productId = await db.transaction(async (tx) => {
      const product = await tx.orm.public.Product.create({
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
        isCustomizable: data.isCustomizable,
        sortOrder: data.sortOrder,
      });

      if (data.categoryIds.length > 0) {
        await tx.orm.public.ProductCategoryLink.createAll(
          data.categoryIds.map((categoryId) => ({
            productId: product.id,
            categoryId,
          })),
        );
      }

      if (data.variants.length > 0) {
        await tx.orm.public.ProductVariant.createAll(
          data.variants.map((variant) => ({
            productId: product.id,
            sku: variant.sku,
            name: variant.name,
            price: asPrice(variant.price),
            compareAtPrice: asCompareAt(variant.compareAtPrice),
            weight: asWeight(variant.weight),
            isActive: variant.isActive,
            sortOrder: variant.sortOrder,
          })),
        );
      }

      return product.id;
    });

    const created = await this.findProductById(productId);

    if (!created) {
      throw new Error("Product was created but could not be read back");
    }

    return created;
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<boolean> {
    return await db.transaction(async (tx) => {
      const patch: {
        name?: string;
        slug?: string;
        description?: string | null;
        status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
        isCustomizable?: boolean;
        sortOrder?: number;
      } = {};

      if (data.name !== undefined) patch.name = data.name;
      if (data.slug !== undefined) patch.slug = data.slug;
      if (data.description !== undefined) patch.description = data.description;
      if (data.status !== undefined) patch.status = data.status;
      if (data.isCustomizable !== undefined) {
        patch.isCustomizable = data.isCustomizable;
      }
      if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;

      if (Object.keys(patch).length === 0) {
        // Only categories are changing. An empty update does nothing, so read
        // the row and rewrite one unchanged column; this also moves `updatedAt`.
        const current = await tx.orm.public.Product.where({ id }).first();

        if (!current) {
          return false;
        }

        patch.sortOrder = current.sortOrder;
      }

      const updated = await tx.orm.public.Product.where({ id }).update(patch);

      if (!updated) {
        return false;
      }

      if (data.categoryIds !== undefined) {
        await tx.orm.public.ProductCategoryLink.where({
          productId: id,
        }).deleteAll();

        if (data.categoryIds.length > 0) {
          await tx.orm.public.ProductCategoryLink.createAll(
            data.categoryIds.map((categoryId) => ({
              productId: id,
              categoryId,
            })),
          );
        }
      }

      return true;
    });
  }

  async findVariantById(variantId: string): Promise<VariantRecord | null> {
    return await db.orm.public.ProductVariant.where({ id: variantId }).first();
  }

  async findVariantBySku(sku: string): Promise<VariantRecord | null> {
    return await db.orm.public.ProductVariant.where({ sku }).first();
  }

  async createVariant(
    productId: string,
    data: NewVariantData,
  ): Promise<VariantRecord> {
    return await db.orm.public.ProductVariant.create({
      productId,
      sku: data.sku,
      name: data.name,
      price: asPrice(data.price),
      compareAtPrice: asCompareAt(data.compareAtPrice),
      weight: asWeight(data.weight),
      isActive: data.isActive,
      sortOrder: data.sortOrder,
    });
  }

  async updateVariant(
    variantId: string,
    data: UpdateVariantData,
  ): Promise<VariantRecord | null> {
    const patch: {
      sku?: string;
      name?: string | null;
      price?: DbPrice;
      compareAtPrice?: DbCompareAt;
      weight?: DbWeight;
      isActive?: boolean;
      sortOrder?: number;
    } = {};

    if (data.sku !== undefined) patch.sku = data.sku;
    if (data.name !== undefined) patch.name = data.name;
    if (data.price !== undefined) patch.price = asPrice(data.price);
    if (data.compareAtPrice !== undefined) {
      patch.compareAtPrice = asCompareAt(data.compareAtPrice);
    }
    if (data.weight !== undefined) patch.weight = asWeight(data.weight);
    if (data.isActive !== undefined) patch.isActive = data.isActive;
    if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;

    return await db.orm.public.ProductVariant.where({ id: variantId }).update(
      patch,
    );
  }
}