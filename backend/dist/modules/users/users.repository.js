import pool from "../database/pool.service.js";
const userRepository = {
    async createUser(createUserPayload) {
        const result = await pool.query(`INSERT INTO users (username, hashed_password)
       VALUES ($1, $2) RETURNING user_id, username`, [createUserPayload.username, createUserPayload.hashedPassword]);
        const user = result.rows[0];
        return user;
    },
    async findUserByUsername(username) {
        const lowercasedUsername = username.toLowerCase();
        const result = await pool.query(`SELECT user_id AS "userId", hashed_password AS "hashedPassword" FROM users WHERE username = $1 LIMIT 1`, [lowercasedUsername]);
        const user = result.rows[0];
        return user ?? null;
    }
};
export default userRepository;
