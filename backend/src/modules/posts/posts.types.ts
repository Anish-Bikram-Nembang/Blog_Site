import { PostEntity } from "../../database/types/post.entity.js";
import { PaginatedData } from "../../shared/types/paginated-data.js";

export interface CreatePostPayload {
  authorId: string;
  title: string;
  slug: string;
  content: string;
  categoryId?: string;
  description: string;
}
export type CreatePostRequest = Omit<CreatePostPayload, 'slug'>;

export interface Post extends PostEntity {
  authorName: string;
  categoryName: string | null;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}

export type PostForFeed = Omit<Post, 'commentCount' | 'content'>;
export type PostForFeedRow = PostForFeed & { total: number };

export type FeedResponse = PaginatedData<PostForFeed>;

