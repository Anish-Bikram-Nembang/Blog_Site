import { ConflictError, NotFoundError } from "../../utils/errors.js"
import commentLikesRepository from "./comment-likes.repository.js"
import { CommentLike } from "./comment-likes.types.js"

interface CommentLikeService {
  createLike(authorId: string, commentId: string): Promise<CommentLike>
  deleteLike(authorId: string, commentId: string): Promise<CommentLike>
}

const commentLikeService: CommentLikeService = {
  async createLike(authorId, commentId) {
    const existingLike = await commentLikesRepository.getLike(authorId, commentId);
    if (existingLike) {
      throw new ConflictError("Like already exists");
    }
    return commentLikesRepository.createLike(authorId, commentId);
  },
  async deleteLike(authorId, commentId) {
    const result = await commentLikesRepository.deleteLike(authorId, commentId);
    if (!result) {
      throw new NotFoundError("Like not found");
    }
    return result;
  }
}

export default commentLikeService;
