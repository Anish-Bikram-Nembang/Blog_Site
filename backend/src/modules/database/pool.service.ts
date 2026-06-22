import { Pool } from "pg";
import config from "../../config.js";

const pool = new Pool({
  user: config.postgresUser,
  password: config.postgresPassword,
  port: config.postgresPort,
  host: config.postgresHost,
  database: config.postgresDatabase,
  max: config.postgresMaxConnections,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
export default pool;
