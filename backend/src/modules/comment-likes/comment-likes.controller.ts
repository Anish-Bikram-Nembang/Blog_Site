import { Request, Response } from "express";
import commentLikeService from "./comment-likes.service.js";
import { UnauthorizedError, ValidationError } from "../../errors/errors.js";

const commentLikeController = {
  async like(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const commentId = req.params.commentId;
    if (typeof commentId !== "string") {
      throw new ValidationError();
    }
    const result = await commentLikeService.createLike(userId, commentId);
    res.status(200).json(result);
  },
  async unlike(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const commentId = req.params.commentId;
    if (typeof commentId !== "string") {
      throw new ValidationError();
    }
    const result = await commentLikeService.deleteLike(userId, commentId);
    res.status(204).json(result);
  }
}
export default commentLikeController;
