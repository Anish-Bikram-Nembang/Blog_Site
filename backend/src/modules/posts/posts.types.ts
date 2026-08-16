import { PostEntity } from "../../database/types/post.entity.js";

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

export interface FeedResponse {
  data: PostForFeed[]
  meta: {
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
}

