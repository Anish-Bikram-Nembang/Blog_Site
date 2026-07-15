export interface PostSchema {
  postId: string;
  authorId: string;
  description: string;
  title: string;
  slug: string;
  content: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  authorId: string;
  title: string;
  content: string;
  categoryId?: string;
  description: string;
}

export interface CreatePostPayload extends CreatePostRequest {
  slug: string;
}
export interface Feed {
  data: PostForFeed[];
  meta: {
    page: number;
    limit: number;
    total: number
  }
}
export type PostWithoutContent = Omit<PostSchema, 'content'>;
export interface PostForFeed extends PostWithoutContent {
  authorName: string;
  categoryName?: string;
  likes: number
}

export interface PostWithMeta extends PostForFeed {
  content: string;
}
