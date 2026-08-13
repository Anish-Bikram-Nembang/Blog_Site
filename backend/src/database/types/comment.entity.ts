export interface CommentEntity {
  commentId: string;
  parentCommentId: string | null;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
