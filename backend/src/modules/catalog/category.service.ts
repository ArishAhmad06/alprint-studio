import { AppError } from "../../common/http/errors/app-error.js";
import { slugify } from "../../shared/utils/slug.js";
import { isUniqueViolation } from "../../shared/utils/db-errors.js";

import type { ICategoryRepository } from "./category.repository.interface.js";
import type {
  AdminCategoryDto,
  CategoryRecord,
  PublicCategoryDto,
  UpdateCategoryData,
} from "./category.types.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.schema.js";

const toPublicDto = (category: CategoryRecord): PublicCategoryDto => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  parentId: category.parentId,
  sortOrder: category.sortOrder,
});

const toAdminDto = (category: CategoryRecord): AdminCategoryDto => ({
  ...toPublicDto(category),
  status: category.status,
  createdAt: category.createdAt.toString(),
  updatedAt: category.updatedAt.toString(),
});

const notFound = () =>
  new AppError(404, "CATEGORY_NOT_FOUND", "Category not found");

const slugTaken = () =>
  new AppError(409, "CATEGORY_SLUG_TAKEN", "A category with this slug already exists");

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  // ---------- public ----------

  async listPublic() {
    const categories = await this.categoryRepository.listActive();

    return categories.map(toPublicDto);
  }

  async getPublicBySlug(slug: string) {
    const category = await this.categoryRepository.findBySlug(slug);

    if (!category || category.status !== "ACTIVE") {
      throw notFound();
    }

    const children = (await this.categoryRepository.listChildren(category.id))
      .filter((child) => child.status === "ACTIVE")
      .map(toPublicDto);

    return { ...toPublicDto(category), children };
  }

  // ---------- owner ----------

  async listAll() {
    const categories = await this.categoryRepository.listAll();

    return categories.map(toAdminDto);
  }

  async getById(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw notFound();
    }

    return toAdminDto(category);
  }

  async create(input: CreateCategoryInput) {
    const slug = input.slug ?? slugify(input.name);

    if (!slug) {
      throw new AppError(
        400,
        "INVALID_SLUG",
        "Could not build a slug from the name, please provide one",
      );
    }

    if (await this.categoryRepository.findBySlug(slug)) {
      throw slugTaken();
    }

    if (input.parentId) {
      await this.assertValidParent(input.parentId, null);
    }

    try {
      const category = await this.categoryRepository.create({
        name: input.name,
        slug,
        description: input.description ?? null,
        parentId: input.parentId ?? null,
        status: input.status,
        sortOrder: input.sortOrder,
      });

      return toAdminDto(category);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw slugTaken();
      }
      throw error;
    }
  }

  async update(id: string, input: UpdateCategoryInput) {
    const existing = await this.categoryRepository.findById(id);

    if (!existing) {
      throw notFound();
    }

    if (input.slug !== undefined && input.slug !== existing.slug) {
      if (await this.categoryRepository.findBySlug(input.slug)) {
        throw slugTaken();
      }
    }

    if (input.parentId) {
      await this.assertValidParent(input.parentId, existing.id);
    }

    if (input.status === "ARCHIVED" && existing.status !== "ARCHIVED") {
      await this.assertCanArchive(existing.id);
    }

    const patch: UpdateCategoryData = { ...input };

    try {
      const updated = await this.categoryRepository.update(id, patch);

      if (!updated) {
        throw notFound();
      }

      return toAdminDto(updated);
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw slugTaken();
      }
      throw error;
    }
  }

  // "Deleting" archives the category so existing products keep their history.
  async archive(id: string) {
    const existing = await this.categoryRepository.findById(id);

    if (!existing) {
      throw notFound();
    }

    if (existing.status === "ARCHIVED") {
      return toAdminDto(existing);
    }

    await this.assertCanArchive(existing.id);

    const updated = await this.categoryRepository.update(id, {
      status: "ARCHIVED",
    });

    if (!updated) {
      throw notFound();
    }

    return toAdminDto(updated);
  }

  // ---------- rules ----------

  private async assertCanArchive(categoryId: string): Promise<void> {
    const children = await this.categoryRepository.listChildren(categoryId);

    if (children.some((child) => child.status !== "ARCHIVED")) {
      throw new AppError(
        409,
        "CATEGORY_HAS_CHILDREN",
        "Archive or move the sub-categories first",
      );
    }
  }

  // The parent must exist, not be archived, and must not be the category
  // itself or one of its descendants (which would create a cycle).
  private async assertValidParent(
    parentId: string,
    selfId: string | null,
  ): Promise<void> {
    const parent = await this.categoryRepository.findById(parentId);

    if (!parent) {
      throw new AppError(400, "PARENT_NOT_FOUND", "Parent category not found");
    }

    if (parent.status === "ARCHIVED") {
      throw new AppError(
        400,
        "PARENT_ARCHIVED",
        "Cannot place a category under an archived parent",
      );
    }

    const visited = new Set<string>();
    let current: CategoryRecord | null = parent;

    while (current && !visited.has(current.id)) {
      if (selfId !== null && current.id === selfId) {
        throw new AppError(
          400,
          "CATEGORY_CYCLE",
          "A category cannot be placed under itself or its own sub-category",
        );
      }

      visited.add(current.id);

      current = current.parentId
        ? await this.categoryRepository.findById(current.parentId)
        : null;
    }
  }
}