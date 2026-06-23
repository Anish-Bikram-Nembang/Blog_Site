import pool from "./pool.service.js"

const seederService = {
  async seedSchema() {
    try {
      await pool.query(`
        CREATE TABLE users (
          user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          hashed_password VARCHAR(255) NOT NULL,
          first_name VARCHAR(255),
          middle_name VARCHAR(255),
          last_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
          category_id UUID REFERENCES categories(category_id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      console.log('posts table created');
      await pool.query(`
        CREATE TABLE post_likes  (
          post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (post_id, user_id)
      )`);
      console.log('post_likes table created');
      await pool.query(`
        CREATE TABLE comments  (
          comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
      console.log('comments table created');
    } catch {
      console.log('failed to create tables');
    }

  }
}
await seederService.seedSchema();
