import { Request, Response } from "express";
import postLikeService from "./post-likes.service.js";

const postLikeController = {
  async like(req: Request, res: Response) {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const result = await postLikeService.createLike(userId, postId);
    res.status(200).json(result);
  },
  async dislike(req: Request, res: Response) {
    const { userId, postId } = req.params;
    const result = await postLikeService.deleteLike(userId, postId);
    res.status(204).json(result);
  }
}
export default postLikeController;
