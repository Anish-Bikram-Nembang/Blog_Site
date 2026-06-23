import { Router } from "express";
import postController from "./posts.controller.js";

const router = Router();

router.get('/feed', postController.getFeed);
router.post('/', postController.createPost)
router.get('/:slug', postController.getPostBySlug);
router.delete('/:id', postController.deletePost)

export default router;
