import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import postRoutes from "../modules/posts/posts.routes.js"
import postLikeRoutes from "../modules/post-likes/post-likes.routes.js"
import { nestedCommentRoutes, flatCommentRoutes } from "../modules/comments/comments.routes.js";
import commentLikesRoutes from "../modules/comment-likes/comment-likes.routes.js";
import authMiddleware from "../modules/auth/auth.middleware.js";
import errorMiddleware from "../utils/error.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use(authMiddleware);
router.use("/posts", postRoutes);
router.use("/posts/:postId", postLikeRoutes);
router.use("/posts/:postId", nestedCommentRoutes);
router.use("/comments", flatCommentRoutes);
router.use("/comments/:commentId", commentLikesRoutes);
router.use(errorMiddleware);

export default router;
