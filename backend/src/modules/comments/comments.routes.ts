import { Router } from "express";
import commentController from "./comments.controller.js";
import attachUser from "../auth/attachUser.middleware.js";
import requireAuth from "../auth/requireAuth.middleware.js";
import authenticated from "../../shared/utils/authenticatedController.js";

export const nestedCommentRoutes = Router({ mergeParams: true });
nestedCommentRoutes.get('/', commentController.getCommentsByPostId);
nestedCommentRoutes.post('/', attachUser, requireAuth, authenticated(commentController.postComment));

export const flatCommentRoutes = Router();
flatCommentRoutes.delete('/:commentId', attachUser, requireAuth, authenticated(commentController.deleteComment));

