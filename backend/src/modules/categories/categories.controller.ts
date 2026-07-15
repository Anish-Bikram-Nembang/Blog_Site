import { Request, Response } from "express";
import categoriesService from "./categories.service.js";
import { NotFoundError, ValidationError } from "../../errors/errors.js";

const categoriesController = {
  async createCategory(req: Request, res: Response) {
    const { name } = req.body;
    if (!name) {
      throw new ValidationError("Category name is required");
    }
    const category = await categoriesService.createCategory(name);
    res.status(201).json(category);
  },
  async getAllCategories(_req: Request, res: Response) {
    const categories = await categoriesService.getAllCategories();
    const response = {
      data: categories,
      meta: {
        total: categories.length
      }
    }
    res.json(response);
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
