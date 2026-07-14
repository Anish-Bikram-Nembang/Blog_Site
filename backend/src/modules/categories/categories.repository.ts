import pool from "../../database/pool.service.js"

interface Category {
  categoryId: string;
  name: string;
}
interface CategoriesRepository {
  getCategoryByName(categoryName: string): Promise<Category | null>
  createCategory(categoryName: string): Promise<Category>
  getAllCategories(): Promise<Category[]>
  getCategoryById(id: string): Promise<Category | null>
}

const categoriesRepository: CategoriesRepository = {
  async getCategoryByName(categoryName: string) {
    const result = await pool.query(`
      SELECT
        category_id AS "categoryId",
        name
      FROM categories
      WHERE name = $1
    `, [categoryName]);
    return result.rows[0] ?? null;
  },
  async createCategory(categoryName: string) {
    const result = await pool.query(`
      INSERT INTO categories (name)
      VALUES ($1) RETURNING category_id AS "categoryId",
      name
    `, [categoryName]);
    return result.rows[0];
  },
  async getAllCategories() {
    const result = await pool.query(`
      SELECT
        category_id AS "categoryId",
        name
      FROM categories
    `);
    return result.rows;
  },
  async getCategoryById(id: string) {
    const result = await pool.query(`
      SELECT
        category_id AS "categoryId",
        name
      FROM categories
      WHERE category_id = $1
    `, [id]);
    return result.rows[0] ?? null;
  }
}

export default categoriesRepository;
