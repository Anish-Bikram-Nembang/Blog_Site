import { migrate } from "./migrate.js";
import pool from "./pool.service.js";


async function resetDatabase() {
  const pg = await pool.connect();
  try {
    await pg.query('BEGIN');
    await pg.query('DROP SCHEMA public CASCADE;');
    await pg.query('CREATE SCHEMA public;');
    await pg.query('COMMIT');
    console.log('Tables successfully dropped!');
  } catch (e) {
    await pg.query('ROLLBACK')
    console.log('Failed to drop tables!');
    throw e;
  } finally {
    pg.release();
  }
  await migrate();
  await pool.end();
}

await resetDatabase();
