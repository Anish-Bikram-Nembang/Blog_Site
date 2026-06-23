import pool from "../database/pool.service.js"
import { PostForFeed, PostWithMeta, CreatePostPayload, PostSchema } from "./posts.types.js"

interface PostRepository {
  getFeed(limit: number, offset: number): Promise<{ data: PostForFeed[], total: number }>
  createPost(createPostPayload: CreatePostPayload): Promise<PostSchema>
  deletePost(postId: string): Promise<void>
  getPostById(postId: string): Promise<PostWithMeta>
  getPostBySlug(slug: string): Promise<PostWithMeta>
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
        p.post_id AS "postId",
        p.author_id AS "authorId",
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.title, p.slug, p.content, p.description,
        u.username AS "authorName",
        COALESCE(COUNT(pl.post_id), 0)::int AS "likes",
        c.name AS "categoryName"
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN post_likes pl ON p.post_id = pl.post_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.post_id=$1
      GROUP BY p.post_id, u.user_id, c.category_id
      `, [postId]);
    return result.rows[0] as PostWithMeta;
  },
  async getPostBySlug(slug) {
    const result = await pool.query(`
      SELECT
        p.post_id AS "postId",
        p.author_id AS "authorId",
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.title, p.slug, p.content, p.description,
        u.username AS "authorName",
        COALESCE(COUNT(pl.post_id), 0)::int AS "likes",
        c.name AS "categoryName"
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN post_likes pl ON p.post_id = pl.post_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.slug = $1
      GROUP BY p.post_id, u.user_id, c.category_id
      `, [slug]);
    return result.rows[0] as PostWithMeta;
  },
  async getFeed(limit, offset) {
    const result = await pool.query(`
      SELECT
        p.post_id AS "postId",
        p.author_id AS "authorId",
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.title, p.slug, p.description,
        u.username AS "authorName",
        COALESCE(COUNT(pl.post_id), 0)::int AS "likes",
        c.name AS "categoryName"
        COUNT(*) OVER() AS "total"
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN post_likes pl ON p.post_id = pl.post_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      GROUP BY p.post_id, u.user_id, c.category_id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
      `, [limit, offset]);

    const total = result.rows[0].total ?? 0;
    return { data: result.rows as PostForFeed[], total };
  }
}
export default postRepository;
