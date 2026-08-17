import { Response } from "express";
import commentLikeService from "./comment-likes.service.instance.js";
import { ValidationError } from "../../errors/errors.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";

const commentLikeController = {
  async like(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    if (typeof commentId !== "string") {
      throw new ValidationError();
    }
    const result = await commentLikeService.createLike(userId, commentId);
    res.status(200).json(result);
  },
  async unlike(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.userId;
    const commentId = req.params.commentId;
    if (typeof commentId !== "string") {
      throw new ValidationError();
    }
    const result = await commentLikeService.deleteLike(userId, commentId);
    res.status(204).json(result);
  }
}
export default commentLikeController;
