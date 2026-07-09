import pool from "./pool.service.js"

const seederService = {
  async seedSchema() {
    try {
      await pool.query(`DROP TABLE IF EXISTS comment_likes`);
      await pool.query(`DROP TABLE IF EXISTS comments`);
      await pool.query(`DROP TABLE IF EXISTS post_likes`);
      await pool.query(`DROP TABLE IF EXISTS posts`);
      await pool.query(`DROP TABLE IF EXISTS categories`);
      await pool.query(`DROP TABLE IF EXISTS users`);
      console.log('tables dropped');
      await pool.query(`
        CREATE TABLE users (
          user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          hashed_password VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          middle_name VARCHAR(255),
          last_name VARCHAR(255),
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
      console.log('users table created');

      await pool.query(`
        CREATE TABLE categories (
          category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) UNIQUE NOT NULL
        )`);
      console.log('categories table created');

      await pool.query(`
        CREATE TABLE posts  (
          post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          author_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          content TEXT NOT NULL,
          category_id UUID REFERENCES categories(category_id) ON DELETE SET NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
      await pool.query(`CREATE INDEX idx_posts_author_id ON posts(author_id)`);
      await pool.query(`CREATE INDEX idx_posts_category_id ON posts(category_id)`);
      console.log('posts table created');

      await pool.query(`
        CREATE TABLE post_likes  (
          post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
          author_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (post_id, author_id)
      )`);
      console.log('post_likes table created');

      await pool.query(`
        CREATE TABLE comments  (
          comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          parent_comment_id UUID REFERENCES comments(comment_id) ON DELETE CASCADE,
          post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
          author_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`);
      await pool.query(`CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id)`);
      await pool.query(`CREATE INDEX idx_comments_post_id ON comments(post_id)`);
      await pool.query(`CREATE INDEX idx_comments_author_id ON comments(author_id)`);
      console.log('comments table created');

      await pool.query(`
        CREATE TABLE comment_likes  (
          comment_id UUID NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE,
          author_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (comment_id, author_id)
      )`);
      console.log('comment_likes table created');

    } catch (err) {
      console.log('failed to create tables', err);
    }

  }
}
await seederService.seedSchema();
