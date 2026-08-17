import { Response } from "express";
import commentService from "./index.js";
import { ValidationError } from "../../errors/errors.js";
import { AuthenticatedRequest, RequestAfterAttachUserMiddleware } from "../auth/auth.types.js";
import { requireString } from "../../shared/utils/typeValidators.js";

const commentController = {
  async getCommentsByPostId(req: RequestAfterAttachUserMiddleware, res: Response) {
    const userId = req.user?.userId;
    const postId = requireString(req.params.postId, 'postId');
    const { limit, page } = req.query;
    const limitNum = Number(limit);
    const pageNum = Number(page);
    if (Number.isNaN(limitNum) || Number.isNaN(pageNum)) {
      throw new ValidationError("limit and offset must be valid numbers");
    }
    const result = await commentService.getCommentsByPostId({ postId, limit: limitNum, page: pageNum }, userId);
    res.send(result);
  },
  async postComment(req: AuthenticatedRequest, res: Response) {
    const postId = requireString(req.params.postId, 'postId');
    const authorId = req.user?.userId;
    const { content } = req.body;
    if (!content) {
      throw new ValidationError("Invalid content");
    }
    const result = await commentService.postComment({ postId, authorId, content });
    res.send(result);
  },
  async deleteComment(req: AuthenticatedRequest, res: Response) {
    const commentId = requireString(req.params.commentId, 'commentId');
    const authorId = req.user?.userId;
    await commentService.deleteComment(commentId, authorId);
    res.status(204).send();
  }
}
export default commentController;
