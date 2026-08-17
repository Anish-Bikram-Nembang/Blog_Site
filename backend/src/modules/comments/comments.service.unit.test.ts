import { describe, it, expect, jest } from '@jest/globals';
import createCommentService, { CommentServiceDeps } from './comments.service.js';
import { NotFoundError } from '../../errors/errors.js';
import { CommentRow } from './comments.types.js';

describe('commentService', () => {
  const commentRow: CommentRow = {
    postId: 'POST_ID',
    parentCommentId: null,
    likeCount: 1,
    isLiked: false,
    commentId: 'COMMENT_ID',
    authorId: 'AUTHOR_ID',
    authorName: 'AUTHOR',
    content: 'COMMENT',
    total: 100,
    createdAt: new Date(),
    updatedAt: new Date(),

  }
  function makeCommentService(overrides?: Partial<jest.Mocked<CommentServiceDeps['commentRepository']>>) {
    const mockedCommentRepository: jest.Mocked<CommentServiceDeps['commentRepository']> = {
      getCommentsByPostId: jest.fn(),
      postComment: jest.fn(),
      deleteComment: jest.fn(),
      ...overrides
    }
    return {
      api: createCommentService({ commentRepository: mockedCommentRepository }),
      mockedCommentRepository
    }
  }
  describe('getCommentsByPostId', () => {
    it('should return data in proper format, and compute page = 1 case correctly', async () => {
      const { api, mockedCommentRepository } = makeCommentService({
        getCommentsByPostId: jest.fn<CommentServiceDeps['commentRepository']['getCommentsByPostId']>().mockResolvedValue(Array.from({ length: 5 }, () => commentRow))
      })
      const comments = await api.getCommentsByPostId({ postId: 'POST_ID', limit: 10, page: 1 }, undefined);
      expect(comments).toEqual({
        data: Array.from({ length: 5 }, () => {
          const { total, ...comment } = commentRow;
          return comment;
        }),
        meta: {
          total: 100,
          page: 1,
          limit: 10,
          hasNextPage: true,
          hasPreviousPage: false,
        }
      })
      expect(mockedCommentRepository.getCommentsByPostId).toHaveBeenCalledWith({ postId: 'POST_ID', limit: 10, offset: 0 }, undefined);
    });
    it('should correctly compute total = 0 cases', async () => {
      const { api, mockedCommentRepository } = makeCommentService({
        getCommentsByPostId: jest.fn<CommentServiceDeps['commentRepository']['getCommentsByPostId']>().mockResolvedValue([])
      })
      const comments = await api.getCommentsByPostId({ postId: 'POST_ID', limit: 10, page: 1 }, undefined);
      expect(comments).toEqual({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      })
      expect(mockedCommentRepository.getCommentsByPostId).toHaveBeenCalledWith({ postId: 'POST_ID', limit: 10, offset: 0 }, undefined);
    })
  });
  describe('deleteComment', () => {
    it('should throw NotFoundError if repo returns null', async () => {
      const { api, mockedCommentRepository } = makeCommentService({
        deleteComment: jest.fn<CommentServiceDeps['commentRepository']['deleteComment']>().mockResolvedValue(null)
      })
      await expect(api.deleteComment('COMMENT_ID', 'AUTHOR_ID')).rejects.toThrow(NotFoundError);
      expect(mockedCommentRepository.deleteComment).toHaveBeenCalledWith('COMMENT_ID', 'AUTHOR_ID');
    });
  })

});
