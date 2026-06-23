import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js"
import postRoutes from "../modules/posts/posts.routes.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);

export default router;
