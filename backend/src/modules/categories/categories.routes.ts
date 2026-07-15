import { Router } from "express";
import categoriesController from "./categories.controller.js";

const router = Router();

router.get('/', categoriesController.getAllCategories)
router.post('/', categoriesController.createCategory)
router.get('/:categoryId', categoriesController.getCategoryById)

export default router;
