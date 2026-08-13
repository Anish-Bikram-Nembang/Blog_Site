import { PoolClient } from "pg";
import { CategoryEntity } from "../types/category.entity.js";

export default async function seedCategories({ pg }: { pg: PoolClient }): Promise<CategoryEntity[]> {
  const categories = ['Tech', 'Gaming', 'Art', 'Cooking', 'Fiction'];
  const result = await pg.query<CategoryEntity>(`
      INSERT INTO categories (name)
      VALUES ($1), ($2), ($3), ($4), ($5)
      RETURNING
      category_id AS "categoryId",
      name,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `, categories);
  return result.rows;
}
