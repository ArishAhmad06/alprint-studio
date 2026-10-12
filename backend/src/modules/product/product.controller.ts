import type { Request, Response } from "express";
import { productService } from "../../infrastructure/container/index.js";
import type {
  AdminProductListQuery,
  PublicProductListQuery,
} from "./product.schema.js";

const param = (req: Request, name: string): string => String(req.params[name]);

export class ProductController {
  // ---------- public ----------

  list = async (_req: Request, res: Response) => {
    const query = res.locals["query"] as PublicProductListQuery;
    const { items, meta } = await productService.listPublic(query);

    return res.status(200).json({ data: items, meta, error: null });
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await productService.getPublicBySlug(param(req, "slug"));

    return res.status(200).json({ data, error: null });
  };

  // ---------- owner: products ----------

  adminList = async (_req: Request, res: Response) => {
    const query = res.locals["query"] as AdminProductListQuery;
    const { items, meta } = await productService.listAdmin(query);

    return res.status(200).json({ data: items, meta, error: null });
  };

  adminGet = async (req: Request, res: Response) => {
    const data = await productService.getAdminById(param(req, "id"));

    return res.status(200).json({ data, error: null });
  };

  adminCreate = async (req: Request, res: Response) => {
    const data = await productService.create(req.body);

    return res.status(201).json({ data, error: null });
  };

  adminUpdate = async (req: Request, res: Response) => {
    const data = await productService.update(param(req, "id"), req.body);

    return res.status(200).json({ data, error: null });
  };

  adminArchive = async (req: Request, res: Response) => {
    const data = await productService.archive(param(req, "id"));

    return res.status(200).json({ data, error: null });
  };

  // ---------- owner: variants ----------

  adminAddVariant = async (req: Request, res: Response) => {
    const data = await productService.addVariant(param(req, "id"), req.body);

    return res.status(201).json({ data, error: null });
  };

  adminUpdateVariant = async (req: Request, res: Response) => {
    const data = await productService.updateVariant(
      param(req, "id"),
      param(req, "variantId"),
      req.body,
    );

    return res.status(200).json({ data, error: null });
  };

  adminDeactivateVariant = async (req: Request, res: Response) => {
    const data = await productService.deactivateVariant(
      param(req, "id"),
      param(req, "variantId"),
    );

    return res.status(200).json({ data, error: null });
  };
}