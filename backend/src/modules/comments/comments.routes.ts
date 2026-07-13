import { Router } from "express";
import commentController from "./comments.controller.js";
import authMiddleware from "../auth/auth.middleware.js";

export const nestedCommentRoutes = Router({ mergeParams: true });
nestedCommentRoutes.get('/', commentController.getCommentsByPostId);
nestedCommentRoutes.post('/', authMiddleware, commentController.postComment);

export const flatCommentRoutes = Router();
flatCommentRoutes.delete('/:commentId', authMiddleware, commentController.deleteComment);

