import { NotFoundError } from "../../errors/errors.js";
import commentRepository from "./comments.repository.js"

const commentService = {
  async getCommentsByPostId(postId: string, limit: number, page: number) {
    const offset = limit * (page - 1);
    const comments = await commentRepository.getCommentsByPostId(postId, limit, offset);
    const response = {
      data: comments,
      meta: {
        total: comments.length,
        limit: limit,
        page: page,

      }
    }
    return response;
  },
  postComment({ postId, authorId, content }: { postId: string, authorId: string, content: string }) {
    return commentRepository.postComment({ postId, authorId, content });
  },
  async removeComment(commentId: string, authorId: string) {
    const result = await commentRepository.removeComment(commentId, authorId);
    if (!result) {
      throw new NotFoundError("Comment not found");
    }
    return result
  }
}

export default commentService;
