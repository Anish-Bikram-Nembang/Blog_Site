import { PostEntity } from "../../database/types/post.entity.js"
import { Queryable } from "../../shared/types/queryable.js"
import { CreatePostPayload, Post, PostForFeedRow } from "./posts.types.js"

export interface PostRepository {
  getFeed({ limit, offset, search, authorId, categoryId }: { limit: number, offset: number, search?: string, authorId?: string, categoryId?: string }, currentUserId: string | undefined): Promise<PostForFeedRow[]>
  createPost(createPostPayload: CreatePostPayload): Promise<PostEntity>
  deletePost(postId: string, authorId: string): Promise<PostEntity | null>
  getPostById(postId: string, currentUserId: string | undefined): Promise<Post>
  getPostBySlug(slug: string, currentUserId: string | undefined): Promise<Post>
}
export default function createPostRepository(deps: {
  db: Queryable
}): PostRepository {
  return {
    async createPost({ authorId, title, content, slug, categoryId, description }) {
      const result = await deps.db.query<PostEntity>(`
      INSERT INTO posts
        (author_id, title, slug, content, category_id, description)
        VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        post_id AS "postId",
        author_id AS "authorId",
        category_id AS "categoryId",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        title, slug, content, description`
        , [authorId, title, slug, content, categoryId ?? null, description]);
      return result.rows[0];
    },
    async deletePost(postId, authorId) {
      const result = await deps.db.query<PostEntity>(`DELETE FROM posts WHERE post_id=$1 AND author_id=$2`, [postId, authorId]);
      return result.rows[0] ?? null;
    },
    async getPostById(postId, currentUserId) {
      const result = await deps.db.query<Post>(`
      SELECT
        p.post_id AS "postId",
        p.author_id AS "authorId",
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.title, p.slug, p.content, p.description,
        u.username AS "authorName",
        c.name AS "categoryName",
        COALESCE(COUNT(DISTINCT(pl.user_id)), 0)::int AS "likeCount",
        COALESCE(COUNT(DISTINCT(pc.comment_id)), 0)::int AS "commentCount",
        EXISTS (SELECT 1 FROM post_likes WHERE post_id = p.post_id AND user_id = $2) AS "isLiked"
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN post_likes pl ON p.post_id = pl.post_id
      LEFT JOIN comments pc ON p.post_id = pc.post_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.post_id=$1
      GROUP BY p.post_id, u.user_id, c.category_id
      `, [postId, currentUserId ?? null]);
      return result.rows[0] ?? null;
    },
    async getPostBySlug(slug, currentUserId) {
      const result = await deps.db.query<Post>(`
      SELECT
        p.post_id AS "postId",
        p.author_id AS "authorId",
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.title, p.slug, p.content, p.description,
        u.username AS "authorName",
        c.name AS "categoryName",
        COALESCE(COUNT(DISTINCT(pl.user_id)), 0)::int AS "likeCount",
        COALESCE(COUNT(DISTINCT(pc.comment_id)), 0)::int AS "commentCount",
        EXISTS (SELECT 1 FROM post_likes WHERE post_id = p.post_id AND user_id = $2) AS "isLiked"
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN post_likes pl ON p.post_id = pl.post_id
      LEFT JOIN comments pc ON p.post_id = pc.post_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.slug=$1
      GROUP BY p.post_id, u.user_id, c.category_id
      `, [slug, currentUserId ?? null]);
      return result.rows[0] ?? null;
    },
    async getFeed({ limit, offset, categoryId, authorId, search }, currentUserId?) {
      const whereClauseArray = [];
      const queryArray: Array<string | number | null> = [limit, offset, currentUserId ?? null];
      if (authorId) {
        queryArray.push(authorId);
        whereClauseArray.push(`p.author_id = $${queryArray.length}`);
      }
      if (categoryId) {
        queryArray.push(categoryId)
        whereClauseArray.push(`c.category_id = $${queryArray.length}`);
      }
      if (search) {
        queryArray.push(`%${search}%`);
        whereClauseArray.push(`(p.title ILIKE $${queryArray.length} OR u.username ILIKE $${queryArray.length})`);
      }
      const whereClause = whereClauseArray.length
        ? `WHERE ${whereClauseArray.join(' AND ')}`
        : '';
      const result = await deps.db.query<PostForFeedRow>(`
      SELECT
        p.post_id AS "postId",
        p.author_id AS "authorId",
        p.category_id AS "categoryId",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt",
        p.title, p.slug, p.description,
        u.username AS "authorName",
        c.name AS "categoryName",
        COALESCE(COUNT(DISTINCT(pl.user_id)), 0)::int AS "likeCount",
        COALESCE(COUNT(DISTINCT(pc.comment_id)), 0)::int AS "commentCount",
        COUNT(*) OVER() AS "total",
        EXISTS (SELECT 1 FROM post_likes WHERE post_id = p.post_id AND user_id = $3) AS "isLiked"
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.user_id
      LEFT JOIN post_likes pl ON p.post_id = pl.post_id
      LEFT JOIN comments pc ON p.post_id = pc.post_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      ${whereClause}
      GROUP BY p.post_id, u.user_id, c.category_id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
      `, queryArray);

      return result.rows;

    }
  }
}

