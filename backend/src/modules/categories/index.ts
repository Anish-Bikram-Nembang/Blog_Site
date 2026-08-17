import createCategoriesService from "./categories.service.js";
import createCategoryRepository from "./categories.repository.js";
import pool from "../../database/pool.service.js";



const categoriesRepository = createCategoryRepository({
  db: pool
});

const categoriesService = createCategoriesService({
  categoriesRepository,
});

export default categoriesService;
