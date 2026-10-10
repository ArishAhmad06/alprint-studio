import { db } from "../../prisma/db.js";

import type { ICategoryRepository } from "./category.repository.interface.js";
import type {
  CategoryRecord,
  CreateCategoryData,
  UpdateCategoryData,
} from "./category.types.js";

export class CategoryRepository implements ICategoryRepository {
  async listActive(): Promise<CategoryRecord[]> {
    return await db.orm.public.Category.where({ status: "ACTIVE" })
      .orderBy([(c) => c.sortOrder.asc(), (c) => c.name.asc()])
      .all();
  }

  async listAll(): Promise<CategoryRecord[]> {
    return await db.orm.public.Category.orderBy([
      (c) => c.sortOrder.asc(),
      (c) => c.name.asc(),
    ]).all();
  }

  async listChildren(parentId: string): Promise<CategoryRecord[]> {
    return await db.orm.public.Category.where({ parentId })
      .orderBy([(c) => c.sortOrder.asc(), (c) => c.name.asc()])
      .all();
  }

  async findById(id: string): Promise<CategoryRecord | null> {
    return await db.orm.public.Category.where({ id }).first();
  }

  async findBySlug(slug: string): Promise<CategoryRecord | null> {
    return await db.orm.public.Category.where({ slug }).first();
  }

  async create(data: CreateCategoryData): Promise<CategoryRecord> {
    return await db.orm.public.Category.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId,
      status: data.status,
      sortOrder: data.sortOrder,
    });
  }

  async update(
    id: string,
    data: UpdateCategoryData,
  ): Promise<CategoryRecord | null> {
    // Only send the fields that were actually provided.
    const patch: {
      name?: string;
      slug?: string;
      description?: string | null;
      parentId?: string | null;
      status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
      sortOrder?: number;
    } = {};

    if (data.name !== undefined) patch.name = data.name;
    if (data.slug !== undefined) patch.slug = data.slug;
    if (data.description !== undefined) patch.description = data.description;
    if (data.parentId !== undefined) patch.parentId = data.parentId;
    if (data.status !== undefined) patch.status = data.status;
    if (data.sortOrder !== undefined) patch.sortOrder = data.sortOrder;

    return await db.orm.public.Category.where({ id }).update(patch);
  }
}