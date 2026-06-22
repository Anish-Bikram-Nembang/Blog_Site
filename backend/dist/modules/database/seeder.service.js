import pool from "./pool.service.js";
const seederService = {
    async seedSchema() {
        try {
            await pool.query(`
        CREATE TABLE users (
          user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          hashed_password VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(255),
          middle_name VARCHAR(255),
          last_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
            console.log('users table created');
        }
        catch {
            console.log('failed to create users table');
        }
    }
};
await seederService.seedSchema();
