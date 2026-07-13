import { Router } from "express";
import commentLikeController from "./comment-likes.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, commentLikeController.like);
router.delete('/', authMiddleware, commentLikeController.unlike);

export default router;
