import { describe, it, expect, jest } from '@jest/globals';
import { NotFoundError } from "../../errors/errors.js";
import createCommentLikesService, { CommentLikesService, CommentLikesServiceDeps } from './comment-likes.service.js';

describe('commentLikesService', () => {
  function makeCommentLikesService(overrides?: Partial<jest.Mocked<CommentLikesServiceDeps['commentLikesRepository']>>): {
    api: CommentLikesService;
    mockedCommentLikesRepository: jest.Mocked<CommentLikesServiceDeps['commentLikesRepository']>
  } {
    const mockedCommentLikesRepository: jest.Mocked<CommentLikesServiceDeps['commentLikesRepository']> = {
      getLike: jest.fn(),
      deleteLike: jest.fn(),
      createLike: jest.fn(),
      ...overrides
    }
    return {
      api: createCommentLikesService({ commentLikesRepository: mockedCommentLikesRepository }),
      mockedCommentLikesRepository,
    }
  }
  describe('createLike', () => {
    it('should like and return the commentLike', async () => {
      const { api } = makeCommentLikesService({
        createLike: jest.fn(() => Promise.resolve({
          commentId: 'COMMENT_ID',
          userId: 'USER_ID',
          createdAt: new Date(),

        }))
      });
      const response = await api.createLike('USER_ID', 'COMMENT_ID');
      expect(response).toEqual({
        commentId: 'COMMENT_ID',
        userId: 'USER_ID',
        createdAt: expect.any(Date),

      })

    });
  });
  describe('deleteLike', () => {
    it('should delete and return the commentLike', async () => {
      const { api, mockedCommentLikesRepository } = makeCommentLikesService({
        deleteLike: jest.fn(() => Promise.resolve({
          commentId: 'COMMENT_ID',
          userId: 'USER_ID',
          createdAt: new Date()
        }))
      });
      const response = await api.deleteLike('USER_ID', 'COMMENT_ID');
      expect(mockedCommentLikesRepository.deleteLike)
        .toHaveBeenCalledWith('USER_ID', 'COMMENT_ID');
      expect(response).toEqual({
        commentId: 'COMMENT_ID',
        userId: 'USER_ID',
        createdAt: expect.any(Date),

      })

    });
    it('should throw NotFoundError when the commentLike is not found', async () => {
      const { api } = makeCommentLikesService({
        deleteLike: jest.fn<CommentLikesServiceDeps['commentLikesRepository']['getLike']>().mockResolvedValue(null),
      });
      await expect(api.deleteLike('USER_ID', 'COMMENT_ID')).rejects.toThrow(NotFoundError);

    });
  });
});
