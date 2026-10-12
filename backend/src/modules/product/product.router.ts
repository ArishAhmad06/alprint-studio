import { Router } from "express";

import { ProductController } from "./product.controller.js";
import {
  adminProductListQuerySchema,
  createProductSchema,
  createVariantSchema,
  productIdParamSchema,
  productSlugParamSchema,
  publicProductListQuerySchema,
  updateProductSchema,
  updateVariantSchema,
  variantParamsSchema,
} from "./product.schema.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/http/middlewares/validate.middleware.js";
import { authenticate } from "../../common/http/middlewares/auth.middleware.js";
import { requireRole } from "../../common/http/middlewares/role.middleware.js";

const controller = new ProductController();

// Public storefront: /api/v1/products
export const productRouter = Router();

productRouter.get(
  "/",
  validateQuery(publicProductListQuerySchema),
  controller.list,
);
productRouter.get(
  "/:slug",
  validateParams(productSlugParamSchema),
  controller.getBySlug,
);

// Owner only: /api/v1/admin/products
export const adminProductRouter = Router();

adminProductRouter.use(authenticate, requireRole("OWNER"));

adminProductRouter.get(
  "/",
  validateQuery(adminProductListQuerySchema),
  controller.adminList,
);
adminProductRouter.post(
  "/",
  validateBody(createProductSchema),
  controller.adminCreate,
);
adminProductRouter.get(
  "/:id",
  validateParams(productIdParamSchema),
  controller.adminGet,
);
adminProductRouter.patch(
  "/:id",
  validateParams(productIdParamSchema),
  validateBody(updateProductSchema),
  controller.adminUpdate,
);
adminProductRouter.delete(
  "/:id",
  validateParams(productIdParamSchema),
  controller.adminArchive,
);

adminProductRouter.post(
  "/:id/variants",
  validateParams(productIdParamSchema),
  validateBody(createVariantSchema),
  controller.adminAddVariant,
);
adminProductRouter.patch(
  "/:id/variants/:variantId",
  validateParams(variantParamsSchema),
  validateBody(updateVariantSchema),
  controller.adminUpdateVariant,
);
adminProductRouter.delete(
  "/:id/variants/:variantId",
  validateParams(variantParamsSchema),
  controller.adminDeactivateVariant,
);