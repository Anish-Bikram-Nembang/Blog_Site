import { CreatePostRequest, Feed, PostSchema, PostWithMeta } from "./posts.types.js"
import postRepository from "./posts.repository.js"
import { ConflictError, ForbiddenError, NotFoundError } from "../../errors/errors.js"

interface PostService {
  getFeed({ limit, page, search, authorId, categoryId }: { limit: number, page: number, search?: string, authorId?: string, categoryId?: string }): Promise<Feed>
  createPost(createPostPayload: CreatePostRequest): Promise<PostSchema>
  deletePost(postId: string, authorId: string): Promise<void>
  getPostById(postId: string): Promise<PostWithMeta>
  getPostBySlug(slug: string): Promise<PostWithMeta>
}

const postService: PostService = {
  async getFeed({ limit, page, search, authorId, categoryId }) {
    const offset = (limit * (page - 1));
    const result = await postRepository.getFeed({ limit, offset, search, authorId, categoryId });
    return {
      data: result.data,
      meta: {
        total: result.total,
        page,
        limit,
      }
    }
  },
  async createPost(createPostPayload) {
    const slug = generateSlug(createPostPayload.title);
    const existingPost = await postRepository.getPostBySlug(slug);
    if (existingPost) {
      throw new ConflictError(`Post with title ${createPostPayload.title} already exists`);
    }
    return postRepository.createPost({ ...createPostPayload, slug });
  },
  async deletePost(postId, authorId) {
    const post = await postRepository.getPostById(postId);
    if (post.authorId !== authorId) {
      throw new ForbiddenError();
    }
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return postRepository.deletePost(postId);
  },
  async getPostById(postId) {
    const post = await postRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
  },
  async getPostBySlug(slug) {
    const post = await postRepository.getPostBySlug(slug);
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
  }

}
export default postService;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
