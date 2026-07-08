import { Router } from "express";
import commentController from "./comments.controller.js";

const router = Router({ mergeParams: true });

router.get('/', commentController.getCommentsByPostId);
router.post('/', commentController.postComment);
router.delete('/', commentController.deleteComment);

export default router;
