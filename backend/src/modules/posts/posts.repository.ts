import pool from "../database/pool.service.js"
import { CreatePostPayload, PostSchema, PostWithoutContent } from "./posts.types.js"

interface PostRepository {
  getFeed(limit: number, offset: number): Promise<PostWithoutContent[]>
  createPost(createPostPayload: CreatePostPayload): Promise<PostSchema>
  deletePost(postId: string): Promise<void>
  getPostById(postId: string): Promise<PostSchema>
  getPostBySlug(slug: string): Promise<PostSchema>
}
const postRepository: PostRepository = {
  async createPost({ authorId, title, content, slug, categoryId }) {
    const result = await pool.query(`
      INSERT INTO posts
        (author_id, title, slug, content, category_id)
        VALUES ($1, $2, $3, $4, $5)
      RETURNING
        post_id AS "postId",
        author_id AS "authorId",
        category_id AS "categoryId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        title, slug, content, description`
      , [authorId, title, slug, content, categoryId ?? null]);
    return result.rows[0] as PostSchema;
  },
  async deletePost(postId) {
    await pool.query(`DELETE FROM posts WHERE post_id=$1`, [postId]);
  },
  async getPostById(postId) {
    const result = await pool.query(`
      SELECT
        post_id AS "postId",
        author_id AS "authorId",
        category_id AS "categoryId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        title, slug, content, description
      FROM posts WHERE post_id=$1
      `, [postId]);
    return result.rows[0] as PostSchema;
  },
  async getPostBySlug(slug) {
    const result = await pool.query(`
      SELECT
        post_id AS "postId",
        author_id AS "authorId",
        category_id AS "categoryId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        title, slug, content, description
      FROM posts WHERE slug=$1
      `, [slug]);
    return result.rows[0] as PostSchema;
  },
  async getFeed(limit, offset) {
    const result = await pool.query(`
      SELECT
        post_id AS "postId",
        author_id AS "authorId",
        category_id AS "categoryId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        title, slug, content, description
      FROM posts LIMIT $1 OFFSET $2
      `, [limit, offset]);
    return result.rows as PostWithoutContent[];
  }
}
export default postRepository;
