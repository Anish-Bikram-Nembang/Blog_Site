import { Router } from "express";
import postLikeController from "./post-likes.controller.js";
import requireAuth from "../auth/requireAuth.middleware.js";
import attachUser from "../auth/attachUser.middleware.js";
import authenticated from "../../shared/utils/authenticatedController.js";

const router = Router({ mergeParams: true });

router.post('/', attachUser, requireAuth, authenticated(postLikeController.like));
router.delete('/', attachUser, requireAuth, authenticated(postLikeController.unlike));

export default router;


