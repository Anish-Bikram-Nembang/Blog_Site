import { CategoriesRepository } from "./categories.repository.js"

export interface CategoriesServiceDeps {
  categoriesRepository: {
    createCategory: CategoriesRepository['createCategory'];
    getAllCategories: CategoriesRepository['getAllCategories'];
    getCategoryById: CategoriesRepository['getCategoryById'];
    getCategoryByName: CategoriesRepository['getCategoryByName'];
  }
}

export default function createCategoriesService(deps: CategoriesServiceDeps) {
  return {
    async createCategory(categoryName: string) {
      return deps.categoriesRepository.createCategory(categoryName);
    },
    async getAllCategories() {
      const categories = await deps.categoriesRepository.getAllCategories();
      return {
        data: categories,
        meta: {
          total: categories.length
        }
      }
    },
    async getCategoryByName(categoryName: string) {
      const category = await deps.categoriesRepository.getCategoryByName(categoryName);
      if (!category) {
        return null;
      }
      return category
    },
    async getCategoryById(categoryId: string) {
      const category = await deps.categoriesRepository.getCategoryById(categoryId);
      if (!category) {
        return null;
      }
      return category
    }
  }
}
