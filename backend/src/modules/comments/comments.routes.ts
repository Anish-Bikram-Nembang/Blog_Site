import { Router } from "express";
import commentController from "./comments.controller.js";

export const nestedCommentRoutes = Router({ mergeParams: true });
nestedCommentRoutes.get('/', commentController.getCommentsByPostId);
nestedCommentRoutes.post('/', commentController.postComment);

export const flatCommentRoutes = Router();
flatCommentRoutes.delete('/:commentId', commentController.deleteComment);

