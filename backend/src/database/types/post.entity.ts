export interface PostEntity {
  postId: string;
  authorId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
