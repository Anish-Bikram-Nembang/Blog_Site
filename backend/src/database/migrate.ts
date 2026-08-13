import fs from 'node:fs/promises';
import path from 'node:path';
import pool from './pool.service.js';

const migrationsDirPath = path.join(import.meta.dirname, "migrations");
const migrationFiles = (await fs.readdir(migrationsDirPath)).sort();

export async function migrate() {
  const pg = await pool.connect();
  try {
    await pg.query('BEGIN');
    for (const file of migrationFiles) {
      const sql = await fs.readFile(path.join(migrationsDirPath, file), "utf8");
      console.log(`Running migration: ${file}`);
      await pg.query(sql);
    }
    await pg.query('COMMIT');
    console.log('Migrations successfully applied!');
  } catch (e) {
    await pg.query('ROLLBACK');
    console.log('Failed to apply migrations!');
    throw e;
  } finally {
    pg.release();
  }
}
