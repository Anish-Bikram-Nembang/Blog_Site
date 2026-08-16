import { describe, it, expect, jest } from '@jest/globals';
import { NotFoundError } from "../../errors/errors.js";
import createPostLikesService, { PostLikesService, PostLikesServiceDeps } from './post-likes.service.js';

describe('postLikesService', () => {
  function makePostLikesService(overrides?: Partial<jest.Mocked<PostLikesServiceDeps['postLikesRepository']>>): {
    api: PostLikesService;
    mockedPostLikesRepository: jest.Mocked<PostLikesServiceDeps['postLikesRepository']>
  } {
    const mockedPostLikesRepository: jest.Mocked<PostLikesServiceDeps['postLikesRepository']> = {
      deleteLike: jest.fn(),
      createLike: jest.fn(),
      ...overrides
    }
    return {
      api: createPostLikesService({ postLikesRepository: mockedPostLikesRepository }),
      mockedPostLikesRepository,
    }
  }
  describe('createLike', () => {
    it('should like and return the postLike', async () => {
      const { api } = makePostLikesService({
        createLike: jest.fn(() => Promise.resolve({
          postId: 'POST_ID',
          userId: 'USER_ID',
          createdAt: new Date(),

        }))
      });
      const response = await api.createLike('USER_ID', 'POST_ID');
      expect(response).toEqual({
        postId: 'POST_ID',
        userId: 'USER_ID',
        createdAt: expect.any(Date),

      })

    });
  });
  describe('deleteLike', () => {
    it('should delete and return the postLike', async () => {
      const { api, mockedPostLikesRepository } = makePostLikesService({
        deleteLike: jest.fn(() => Promise.resolve({
          postId: 'POST_ID',
          userId: 'USER_ID',
          createdAt: new Date()
        }))
      });
      const response = await api.deleteLike('USER_ID', 'POST_ID');
      expect(mockedPostLikesRepository.deleteLike)
        .toHaveBeenCalledWith('USER_ID', 'POST_ID');
      expect(response).toEqual({
        postId: 'POST_ID',
        userId: 'USER_ID',
        createdAt: expect.any(Date),

      })

    });
    it('should throw NotFoundError when the postLike is not found', async () => {
      const { api } = makePostLikesService({
        deleteLike: jest.fn<PostLikesServiceDeps['postLikesRepository']['deleteLike']>().mockResolvedValue(null),
      });
      await expect(api.deleteLike('USER_ID', 'POST_ID')).rejects.toThrow(NotFoundError);

    });
  });
});
