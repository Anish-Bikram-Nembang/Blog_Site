import { Router } from "express";
import commentLikeController from "./comment-likes.controller.js";
import requireAuth from "../auth/requireAuth.middleware.js";
import attachUser from "../auth/attachUser.middleware.js";
import authenticated from "../../shared/utils/authenticatedController.js";

const router = Router({ mergeParams: true });

router.post('/', attachUser, requireAuth, authenticated(commentLikeController.like));
router.delete('/', attachUser, requireAuth, authenticated(commentLikeController.unlike));

export default router;
