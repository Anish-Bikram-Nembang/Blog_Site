import { Router } from "express";
import categoriesController from "./categories.controller.js";
import attachUser from "../auth/attachUser.middleware.js";
import requireAuth from "../auth/requireAuth.middleware.js";
import requireAdmin from "../../shared/middlewares/requireAdmin.js";
import authenticated from "../../shared/utils/authenticatedController.js";

const router = Router();

router.get('/', categoriesController.getAllCategories)
router.post('/', attachUser, requireAuth, authenticated(requireAdmin), categoriesController.createCategory)
router.get('/:categoryId', categoriesController.getCategoryById)

export default router;
