import { Router } from "express";
import postController from "./posts.controller.js";
import postLikeController from "../post-likes/post-likes.controller.js";

const router = Router();

router.get('/feed', postController.getFeed);
router.post('/:postId/likes', postLikeController.like);
router.delete('/:postId/likes', postLikeController.unlike);
router.post('/', postController.createPost)
router.get('/:slug', postController.getPostBySlug);
router.delete('/:id', postController.deletePost)

export default router;
