import { ConflictError } from "../../errors/errors.js";
import categoriesRepository from "./categories.repository.js"

const categoriesService = {
  async createCategory(categoryName: string) {
    const existingCategory = await categoriesRepository.getCategoryByName(categoryName);
    if (existingCategory) {
      throw new ConflictError(`Category with name ${categoryName} already exists`);
    }
    return categoriesRepository.createCategory(categoryName);
  },
  getAllCategories() {
    return categoriesRepository.getAllCategories();
  },
  getCategoryById(categoryId: string) {
    return categoriesRepository.getCategoryById(categoryId);
  }
}
export default categoriesService;
