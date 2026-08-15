import { CommentLikeEntity } from "../../database/types/comment-like.entity.js";
import { NotFoundError } from "../../errors/errors.js"
import { CommentLikesRepository } from "./comment-likes.repository.js"
export interface CommentLikesService {
  createLike(authorId: string, commentId: string): Promise<CommentLikeEntity>
  deleteLike(authorId: string, commentId: string): Promise<CommentLikeEntity>
}
export interface CommentLikesServiceDeps {
  commentLikesRepository: {
    createLike: CommentLikesRepository['createLike'];
    deleteLike: CommentLikesRepository['deleteLike'];
  }
}

export default function createCommentLikesService(deps: CommentLikesServiceDeps): CommentLikesService {
  return {
    async createLike(authorId, commentId) {
      return deps.commentLikesRepository.createLike(authorId, commentId);
    },
    async deleteLike(authorId, commentId) {
      const result = await deps.commentLikesRepository.deleteLike(authorId, commentId);
      if (!result) {
        throw new NotFoundError("Like not found");
      }
      return result;
    }
  }
}

