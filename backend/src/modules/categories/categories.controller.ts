import { Request, Response } from "express";
import categoriesService from "./categories.service.js";
import { NotFoundError } from "../../utils/errors.js";

const categoriesController = {
  async getAllCategories(_req: Request, res: Response) {
    const categories = await categoriesService.getAllCategories();
    res.json(categories);
  },
  async getCategoryById(req: Request, res: Response) {
    const { categoryId } = req.params;
    if (typeof categoryId !== "string") {
      throw new NotFoundError(`Category with ID ${categoryId} not found`);
    }
    const category = await categoriesService.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundError(`Category with ID ${categoryId} not found`);
    }
    res.json(category);
  }
}

export default categoriesController;
