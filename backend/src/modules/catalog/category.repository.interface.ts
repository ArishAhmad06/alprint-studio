import type {
  CategoryRecord,
  CreateCategoryData,
  UpdateCategoryData,
} from "./category.types.js";

export interface ICategoryRepository {
  listActive(): Promise<CategoryRecord[]>;

  listAll(): Promise<CategoryRecord[]>;

  listChildren(parentId: string): Promise<CategoryRecord[]>;

  findById(id: string): Promise<CategoryRecord | null>;

  findBySlug(slug: string): Promise<CategoryRecord | null>;

  create(data: CreateCategoryData): Promise<CategoryRecord>;

  update(id: string, data: UpdateCategoryData): Promise<CategoryRecord | null>;
}