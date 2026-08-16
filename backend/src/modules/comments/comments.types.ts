import { CommentEntity } from "../../database/types/comment.entity.js";
import { PaginatedData } from "../../shared/types/paginated-data.js";

export interface Comment extends CommentEntity {
  authorName: string;
  likeCount: number
  isLiked: boolean;
}

export type CommentRow = Comment & { total: number };

export type CommentsResponse = PaginatedData<Comment>;
