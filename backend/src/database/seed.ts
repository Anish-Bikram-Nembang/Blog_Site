import pool from "./pool.service.js";
import seedAdmin from "./seed-data/admin.seed.js";
import seedUsers from "./seed-data/users.seed.js";
import seedCategories from "./seed-data/categories.seed.js";

async function seed() {
  const pg = await pool.connect();
  try {
    await pg.query('BEGIN');
    const admin = await seedAdmin({ pg });
    const users = await seedUsers({ pg });
    const categories = await seedCategories({ pg });
    await pg.query('COMMIT');
    console.log(admin);
    console.log(categories);
  } catch (e) {
    await pg.query('ROLLBACK');
    throw e;
  } finally {
    pg.release();
    await pool.end();
  }
}
await seed();
