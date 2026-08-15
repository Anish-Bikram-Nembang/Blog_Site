import createCategoriesService from "./categories.service.js";
import categoriesRepository from "./categories.repository.js";

const categoriesService = createCategoriesService({
  categoriesRepository,
});

export default categoriesService;
