import { describe, it, expect, jest } from '@jest/globals';
import createCategoriesService, { CategoriesServiceDeps } from './categories.service.js';

describe('categoriesService', () => {
  const category = {
    categoryId: '1',
    name: 'CATEGORY',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  function makeCategoriesService(overrides?: Partial<jest.Mocked<CategoriesServiceDeps['categoriesRepository']>>) {
    const mockedCategoriesRepository: jest.Mocked<CategoriesServiceDeps['categoriesRepository']> = {
      createCategory: jest.fn(),
      getCategoryByName: jest.fn(),
      getCategoryById: jest.fn(),
      getAllCategories: jest.fn(),
      ...overrides
    }
    return {
      mockedCategoriesRepository,
      api: createCategoriesService({ categoriesRepository: mockedCategoriesRepository })
    }
  }
  describe('createCategory', () => {
    it('should create and return the category', async () => {
      const { api, mockedCategoriesRepository } = makeCategoriesService({
        createCategory: jest.fn<CategoriesServiceDeps['categoriesRepository']['createCategory']>().mockResolvedValue(category)
      });
      const createdCategory = await api.createCategory(category.name);
      expect(createdCategory).toEqual(category);
      expect(mockedCategoriesRepository.createCategory).toHaveBeenCalledWith(category.name);
    });
  }
  );
  describe('getAllCategories', () => {
    it('should return data in proper shape', async () => {
      const sampleCategories = Array.from({ length: 5 }, () => category);
      const { api } = makeCategoriesService({
        getAllCategories: jest.fn<CategoriesServiceDeps['categoriesRepository']['getAllCategories']>().mockResolvedValue(sampleCategories)
      });
      const result = await api.getAllCategories();
      expect(result).toEqual({
        data: sampleCategories,
        meta: {
          total: 5
        }
      });
    });
    it('should return empty data and total zero when no categories exist', async () => {
      const { api } = makeCategoriesService({
        getAllCategories: jest.fn<CategoriesServiceDeps['categoriesRepository']['getAllCategories']>().mockResolvedValue([])
      });
      const result = await api.getAllCategories();
      expect(result).toEqual({
        data: [],
        meta: {
          total: 0
        }
      });
    });
  })
  describe('getCategoryById', () => {
    it('should return category if found', async () => {
      const { api, mockedCategoriesRepository } = makeCategoriesService({
        getCategoryById: jest.fn<CategoriesServiceDeps['categoriesRepository']['getCategoryById']>().mockResolvedValue(category),
      });
      const result = await api.getCategoryById(category.categoryId);
      expect(mockedCategoriesRepository.getCategoryById).toHaveBeenCalledWith(category.categoryId);
      expect(result).toEqual(category);

    });
    it('should return null if category not found', async () => {
      const { api, mockedCategoriesRepository } = makeCategoriesService({
        getCategoryById: jest.fn<CategoriesServiceDeps['categoriesRepository']['getCategoryById']>().mockResolvedValue(null),
      });
      const result = await api.getCategoryById(category.categoryId);
      expect(mockedCategoriesRepository.getCategoryById).toHaveBeenCalledWith(category.categoryId);
      expect(result).toBe(null);
    })
  })
  describe('getCategoryByName', () => {
    it('should return category if found', async () => {
      const { api, mockedCategoriesRepository } = makeCategoriesService({
        getCategoryByName: jest.fn<CategoriesServiceDeps['categoriesRepository']['getCategoryByName']>().mockResolvedValue(category),
      });
      const result = await api.getCategoryByName(category.name);
      expect(mockedCategoriesRepository.getCategoryByName).toHaveBeenCalledWith(category.name);
      expect(result).toEqual(category);

    });
    it('should return null if category not found', async () => {
      const { api, mockedCategoriesRepository } = makeCategoriesService({
        getCategoryByName: jest.fn<CategoriesServiceDeps['categoriesRepository']['getCategoryByName']>().mockResolvedValue(null),
      });
      const result = await api.getCategoryByName(category.name);
      expect(mockedCategoriesRepository.getCategoryByName).toHaveBeenCalledWith(category.name);
      expect(result).toBe(null);
    })

  })
})
