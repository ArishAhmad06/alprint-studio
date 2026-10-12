import type {
  CreateProductData,
  ListProductsParams,
  NewVariantData,
  ProductWithRelations,
  UpdateProductData,
  UpdateVariantData,
  VariantRecord,
} from "./product.types.js";

export interface IProductRepository {
  listProducts(
    params: ListProductsParams,
  ): Promise<{ items: ProductWithRelations[]; total: number }>;

  findProductById(id: string): Promise<ProductWithRelations | null>;

  findProductBySlug(slug: string): Promise<ProductWithRelations | null>;

  createProduct(data: CreateProductData): Promise<ProductWithRelations>;

  updateProduct(id: string, data: UpdateProductData): Promise<boolean>;

  findVariantById(variantId: string): Promise<VariantRecord | null>;

  findVariantBySku(sku: string): Promise<VariantRecord | null>;

  createVariant(
    productId: string,
    data: NewVariantData,
  ): Promise<VariantRecord>;

  updateVariant(
    variantId: string,
    data: UpdateVariantData,
  ): Promise<VariantRecord | null>;
}