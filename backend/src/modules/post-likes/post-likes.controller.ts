import { Response } from "express";
import postLikesService from "./index.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";
import { requireString } from "../../shared/utils/typeValidators.js";

const postLikeController = {
  async like(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.userId;
    const postId = requireString(req.params.postId, 'postId');
    const result = await postLikesService.createLike(userId, postId);
    res.status(200).json(result);
  },
  async unlike(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.userId;
    const postId = requireString(req.params.postId, 'postId');
    const result = await postLikesService.deleteLike(userId, postId);
    res.status(204).json(result);
  }
}
export default postLikeController;
