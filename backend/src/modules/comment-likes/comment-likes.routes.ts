import { Router } from "express";
import commentLikeController from "./comment-likes.controller.js";

const router = Router({ mergeParams: true });

router.post('/', commentLikeController.like);
router.delete('/', commentLikeController.unlike);

export default router;
