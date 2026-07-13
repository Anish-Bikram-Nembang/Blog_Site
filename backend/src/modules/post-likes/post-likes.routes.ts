import { Router } from "express";
import postLikeController from "./post-likes.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, postLikeController.like);
router.delete('/', authMiddleware, postLikeController.unlike);

export default router;


