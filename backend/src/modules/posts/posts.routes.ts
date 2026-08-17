import { Router } from "express";
import postController from "./posts.controller.js";
import attachUser from "../auth/attachUser.middleware.js";
import requireAuth from "../auth/requireAuth.middleware.js";
import requireAdmin from "../../shared/middlewares/requireAdmin.js";
import authenticated from "../../shared/utils/authenticatedController.js";

const router = Router();

router.get('/feed', postController.getFeed);
router.post('/', attachUser, requireAuth, authenticated(requireAdmin), authenticated(postController.createPost));
router.get('/:slug', postController.getPostBySlug);
router.delete('/:postId', attachUser, requireAuth, authenticated(requireAdmin), authenticated(postController.deletePost));

export default router;
