import pool from "../database/pool.service.js"

interface Category {
  categoryId: string;
  name: string;
}
interface CategoriesRepository {
  getAllCategories(): Promise<Category[]>
  getCategoryById(id: string): Promise<Category | null>
}

const categoriesRepository: CategoriesRepository = {
  async getAllCategories() {
    const result = await pool.query(`
      SELECT
        category_id AS "categoryId",
        name AS "name",
      FROM categories
    `);
    return result.rows;
  },
  async getCategoryById(id: string) {
    const result = await pool.query(`
      SELECT
        category_id AS "categoryId",
        name AS "name",
      FROM categories
      WHERE id = $1
    `, [id]);
    return result.rows[0] ?? null;
  }
}

export default categoriesRepository;
