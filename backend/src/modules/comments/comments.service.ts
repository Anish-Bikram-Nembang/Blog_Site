import { NotFoundError } from "../../errors/errors.js";
import commentRepository from "./comments.repository.js"

const commentService = {
  getCommentsByPostId(postId: string, limit: number, offset: number) {
    return commentRepository.getCommentsByPostId(postId, limit, offset);
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
