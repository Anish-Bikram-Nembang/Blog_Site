import categoriesRepository from "./categories.repository.js"

const categoriesService = {
  getAllCategories() {
    return categoriesRepository.getAllCategories();
  },
  getCategoryById(categoryId: string) {
    return categoriesRepository.getCategoryById(categoryId);
  }
}
export default categoriesService;
