import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import postRoutes from "../modules/posts/posts.routes.js"
import postLikeRoutes from "../modules/post-likes/post-likes.routes.js"
import authMiddleware from "../modules/auth/auth.middleware.js";
import errorMiddleware from "../utils/error.middleware.js";

const router = Router();

router.use("/auth", authRoutes);
router.use(authMiddleware);
router.use("/posts", postRoutes);
router.use("/posts", postLikeRoutes);
router.use(errorMiddleware);

export default router;
