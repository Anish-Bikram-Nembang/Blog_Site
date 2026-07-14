import { Router } from "express";
import postController from "./posts.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router();

router.get('/feed', postController.getFeed);
router.post('/', authMiddleware, postController.createPost)
router.get('/:slug', postController.getPostBySlug);
router.delete('/:postId', authMiddleware, postController.deletePost)

export default router;
