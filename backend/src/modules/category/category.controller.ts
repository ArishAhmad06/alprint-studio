import type { Request, Response } from "express";
import { categoryService } from "../../infrastructure/container/index.js";

const idParam = (req: Request): string => String(req.params["id"]);

export class CategoryController {
  // ---------- public ----------

  list = async (_req: Request, res: Response) => {
    const data = await categoryService.listPublic();

    return res.status(200).json({ data, error: null });
  };

  getBySlug = async (req: Request, res: Response) => {
    const data = await categoryService.getPublicBySlug(
      String(req.params["slug"]),
    );

    return res.status(200).json({ data, error: null });
  };

  // ---------- owner ----------

  adminList = async (_req: Request, res: Response) => {
    const data = await categoryService.listAll();

    return res.status(200).json({ data, error: null });
  };

  adminGet = async (req: Request, res: Response) => {
    const data = await categoryService.getById(idParam(req));

    return res.status(200).json({ data, error: null });
  };

  adminCreate = async (req: Request, res: Response) => {
    const data = await categoryService.create(req.body);

    return res.status(201).json({ data, error: null });
  };

  adminUpdate = async (req: Request, res: Response) => {
    const data = await categoryService.update(idParam(req), req.body);

    return res.status(200).json({ data, error: null });
  };

  adminArchive = async (req: Request, res: Response) => {
    const data = await categoryService.archive(idParam(req));

    return res.status(200).json({ data, error: null });
  };
}