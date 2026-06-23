import { CreatePostPayload, Feed, PostSchema, PostWithMeta } from "./posts.types.js"
import postRepository from "./posts.repository.js"
import { NotFoundError } from "../../utils/errors.js"
import userService from "../users/users.service.js"

interface PostService {
  getFeed(limit: number, page: number): Promise<Feed>
  createPost(createPostPayload: CreatePostPayload): Promise<PostSchema>
  deletePost(postId: string): Promise<void>
  getPostById(postId: string): Promise<PostWithMeta>
  getPostBySlug(slug: string): Promise<PostWithMeta>
}

const postService: PostService = {
  async getFeed(limit, page) {
    const offset = page * limit;
    const result = await postRepository.getFeed(limit, offset);
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
    const author = await userService.findUserById(createPostPayload.authorId);
    if (!author) throw new NotFoundError('Author not found');
    return postRepository.createPost(createPostPayload);
  },
  async deletePost(postId) {
    const post = await postRepository.getPostById(postId);
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
