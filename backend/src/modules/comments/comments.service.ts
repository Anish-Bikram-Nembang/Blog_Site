import { CommentEntity } from "../../database/types/comment.entity.js";
import { NotFoundError } from "../../errors/errors.js";
import { PaginatedData } from "../../shared/types/paginated-data.js";
import { CommentRepository } from "./comments.repository.js"
import { Comment } from "./comments.types.js";

export interface CommentServiceDeps {
  commentRepository: {
    getCommentsByPostId: CommentRepository['getCommentsByPostId'];
    postComment: CommentRepository['postComment'];
    deleteComment: CommentRepository['deleteComment'];
  }
}
export interface CommentService {
  getCommentsByPostId({ postId, limit, page, }: { postId: string, limit: number, page: number }, currentUserId: undefined | string): Promise<PaginatedData<Comment>>;
  postComment({ postId, authorId, content }: { postId: string, authorId: string, content: string }): Promise<CommentEntity>;
  deleteComment(commentId: string, authorId: string): Promise<CommentEntity>;

}
export default function createCommentService(deps: CommentServiceDeps): CommentService {
  return {
    async getCommentsByPostId({ postId, limit, page }, currentUserId) {
      const offset = limit * (page - 1);
      const comments = await deps.commentRepository.getCommentsByPostId({ postId, limit, offset }, currentUserId);
      const total = comments[0]?.total ?? 0;
      const response = {
        data: comments.map((c) => {
          const { total, ...comment } = c;
          return comment;
        }),
        meta: {
          total,
          limit: limit,
          page: page,
          hasNextPage: offset + limit < total,
          hasPreviousPage: offset > 0
        }
      }
      return response;
    },
    postComment({ postId, authorId, content }) {
      return deps.commentRepository.postComment({ postId, authorId, content });
    },
    async deleteComment(commentId: string, authorId: string) {
      const result = await deps.commentRepository.deleteComment(commentId, authorId);
      if (!result) {
        throw new NotFoundError("Comment not found");
      }
      return result
    }
  }
}

