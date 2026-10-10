import { Router } from "express";

import { CategoryController } from "./category.controller.js";
import {
  categoryIdParamSchema,
  categorySlugParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";
import {
  validateBody,
  validateParams,
} from "../../common/http/middlewares/validate.middleware.js";
import { authenticate } from "../../common/http/middlewares/auth.middleware.js";
import { requireRole } from "../../common/http/middlewares/role.middleware.js";

const controller = new CategoryController();

// Public storefront: GET /api/v1/categories
export const categoryRouter = Router();

categoryRouter.get("/", controller.list);
categoryRouter.get(
  "/:slug",
  validateParams(categorySlugParamSchema),
  controller.getBySlug,
);

// Owner only: /api/v1/admin/categories
export const adminCategoryRouter = Router();

adminCategoryRouter.use(authenticate, requireRole("OWNER"));

adminCategoryRouter.get("/", controller.adminList);
adminCategoryRouter.post(
  "/",
  validateBody(createCategorySchema),
  controller.adminCreate,
);
adminCategoryRouter.get(
  "/:id",
  validateParams(categoryIdParamSchema),
  controller.adminGet,
);
adminCategoryRouter.patch(
  "/:id",
  validateParams(categoryIdParamSchema),
  validateBody(updateCategorySchema),
  controller.adminUpdate,
);
adminCategoryRouter.delete(
  "/:id",
  validateParams(categoryIdParamSchema),
  controller.adminArchive,
);