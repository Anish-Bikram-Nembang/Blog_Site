import { DatabaseError } from "pg";
import { ConflictError } from "../../errors/errors.js";
import { CategoryEntity } from "../../database/types/category.entity.js";
import { Queryable } from "../../shared/types/queryable.js";

export interface CategoriesRepository {
  getCategoryByName(categoryName: string): Promise<CategoryEntity | null>
  createCategory(categoryName: string): Promise<CategoryEntity>
  getAllCategories(): Promise<CategoryEntity[]>
  getCategoryById(id: string): Promise<CategoryEntity | null>
}

export default function createCategoryRepository(deps: { db: Queryable }): CategoriesRepository {
  return {
    async getCategoryByName(categoryName: string) {
      const result = await deps.db.query(`
      SELECT
        category_id AS "categoryId",
        name
      FROM categories
      WHERE name = $1
    `, [categoryName]);
      return result.rows[0] ?? null;
    },
    async createCategory(categoryName: string) {
      try {
        const result = await deps.db.query(`
      INSERT INTO categories (name)
      VALUES ($1) RETURNING category_id AS "categoryId",
      name
    `, [categoryName]);
        return result.rows[0];

      } catch (e) {
        if (e instanceof DatabaseError && e.code === "23505") {
          if (e.constraint === "categories_name_key") {
            throw new ConflictError(`Category ${categoryName} already exists`);
          }
        }
        throw e;

      }
    },
    async getAllCategories() {
      const result = await deps.db.query(`
      SELECT
        category_id AS "categoryId",
        name
      FROM categories
    `);
      return result.rows;
    },
    async getCategoryById(id: string) {
      const result = await deps.db.query(`
      SELECT
        category_id AS "categoryId",
        name
      FROM categories
      WHERE category_id = $1
    `, [id]);
      return result.rows[0] ?? null;
    }
  }
}

