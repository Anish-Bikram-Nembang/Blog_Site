import { Request, Response } from "express";
import commentService from "./comments.service.js";
import { ValidationError, UnauthorizedError } from "../../errors/errors.js";

const commentController = {
  async getCommentsByPostId(req: Request, res: Response) {
    const { postId } = req.params;
    const { limit, offset } = req.query;
    const limitNum = Number(limit);
    const offsetNum = Number(offset);
    if (Number.isNaN(limitNum) || Number.isNaN(offsetNum)) {
      throw new ValidationError("limit and offset must be valid numbers");
    }
    if (typeof postId !== 'string') {
      throw new ValidationError("postId should be a string");
    }
    const result = await commentService.getCommentsByPostId(postId, Number(limit), Number(offset));
    res.send(result);
  },
  async postComment(req: Request, res: Response) {
    const postId = req.params.postId;
    const authorId = req.user?.userId;
    const { content } = req.body;

    if (typeof postId !== 'string') {
      throw new ValidationError("postId should be a string");
    }
    if (!content) {
      throw new ValidationError("Invalid content");
    }

    if (!authorId) {
      throw new UnauthorizedError();
    }
    const result = await commentService.postComment({ postId, authorId, content });
    res.send(result);
  },
  async deleteComment(req: Request, res: Response) {
    const commentId = req.params.commentId;
    if (typeof commentId !== 'string') {
      throw new ValidationError("postId should be a string");
    }
    const authorId = req.user?.userId;
    if (!authorId) {
      throw new UnauthorizedError();
    }
    const result = await commentService.removeComment(commentId, authorId);
    res.send(result);
  }
}
export default commentController;
