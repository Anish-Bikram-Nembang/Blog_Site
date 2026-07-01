import { Router } from "express";
import postLikeController from "./post-likes.controller.js";

const router = Router();

router.post('/:postId/likes', postLikeController.like);
router.delete('/:postId/likes', postLikeController.unlike);

export default router;


