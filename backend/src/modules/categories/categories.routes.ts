import { Router } from "express";
import categoriesController from "./categories.controller.js";

const router = Router();

router.get('/', categoriesController.getAllCategories)
router.get('/:categoryId', categoriesController.getCategoryById)

export default router;
