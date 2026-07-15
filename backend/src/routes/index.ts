import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import postRoutes from "../modules/posts/posts.routes.js"
import postLikeRoutes from "../modules/post-likes/post-likes.routes.js"
import categoriesRouter from "../modules/categories/categories.routes.js";
import { nestedCommentRoutes, flatCommentRoutes } from "../modules/comments/comments.routes.js";
import commentLikesRoutes from "../modules/comment-likes/comment-likes.routes.js";
import errorMiddleware from "../errors/errors.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/posts/:postId/like", postLikeRoutes);
router.use("/posts/:postId/comments", nestedCommentRoutes);
router.use("/comments", flatCommentRoutes);
router.use("/comments/:commentId/like", commentLikesRoutes);
router.use("/categories", categoriesRouter);
router.use(errorMiddleware);

export default router;
