import { CreatePostRequest, FeedResponse, Post } from "./posts.types.js"
import { PostRepository } from "./posts.repository.js"
import { NotFoundError } from "../../errors/errors.js"
import { PostEntity } from "../../database/types/post.entity.js"

export interface PostService {
  getFeed({ limit, page, search, authorId, categoryId }: { limit: number, page: number, search?: string, authorId?: string, categoryId?: string }, currentUserId: string | undefined): Promise<FeedResponse>
  createPost(createPostPayload: CreatePostRequest): Promise<PostEntity>
  deletePost(postId: string, authorId: string): Promise<PostEntity>
  getPostById(postId: string, currentUserId: string | undefined): Promise<Post | null>
  getPostBySlug(slug: string, currentUserId: string | undefined): Promise<Post | null>
}
export interface PostServiceDeps {
  postRepository: {
    createPost: PostRepository['createPost'];
    getPostById: PostRepository['getPostById'];
    getPostBySlug: PostRepository['getPostBySlug'];
    getFeed: PostRepository['getFeed'];
    deletePost: PostRepository['deletePost'];
  }
}
export default function createPostService(deps: PostServiceDeps): PostService {
  return {
    async getFeed({ limit, page, search, authorId, categoryId }, currentUserId) {
      const offset = (limit * (page - 1));
      const posts = await deps.postRepository.getFeed({ limit, offset, search, authorId, categoryId }, currentUserId);
      const total = posts[0]?.total ?? 0
      return {
        data: posts.map(({ total, ...post }) => post),
        meta: {
          total,
          page,
          limit,
          hasNextPage: offset + limit < total,
          hasPreviousPage: offset > 0
        }
      }
    },
    async createPost(createPostPayload) {
      const slug = generateSlug(createPostPayload.title);
      return deps.postRepository.createPost({ ...createPostPayload, slug });
    },
    async deletePost(postId, authorId) {
      const post = await deps.postRepository.deletePost(postId, authorId);
      if (!post) {
        throw new NotFoundError('Post not found');
      }
      return post;
    },
    async getPostById(postId, currentUserId) {
      return deps.postRepository.getPostById(postId, currentUserId);
    },
    async getPostBySlug(slug, currentUserId) {
      return deps.postRepository.getPostBySlug(slug, currentUserId);
    }

  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
