import { Router } from "express";
import postLikeController from "./post-likes.controller.js";

const router = Router({ mergeParams: true });

router.post('/', postLikeController.like);
router.delete('/', postLikeController.unlike);

export default router;


