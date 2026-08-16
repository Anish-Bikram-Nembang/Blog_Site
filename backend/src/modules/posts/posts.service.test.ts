import { describe, it, expect, jest } from '@jest/globals';
import createPostService, { generateSlug, PostServiceDeps } from './posts.service.js';
import { PostForFeedRow } from './posts.types.js';
import { NotFoundError } from '../../errors/errors.js';

describe('postService', () => {
  const postForFeedRow: PostForFeedRow = {
    postId: 'POST_ID',
    authorId: 'AUTHOR_ID',
    authorName: 'AUTHOR',
    categoryId: 'CATEGORY_ID',
    categoryName: 'CATEGORY',
    title: 'POST TITLE',
    slug: 'post-title',
    description: 'A post',
    likeCount: 4,
    isLiked: true,
    total: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  function makePostService(overrides?: Partial<jest.Mocked<PostServiceDeps['postRepository']>>) {
    const mockedPostRepository: jest.Mocked<PostServiceDeps['postRepository']> = {
      createPost: jest.fn(),
      getPostById: jest.fn(),
      getPostBySlug: jest.fn(),
      getFeed: jest.fn(),
      deletePost: jest.fn(),
      ...overrides
    }
    return {
      api: createPostService({ postRepository: mockedPostRepository }),
      mockedPostRepository,
    }
  }
  describe('getFeed', () => {
    it('should return data in the proper format', async () => {
      const { api, mockedPostRepository } = makePostService({
        getFeed: jest.fn<PostServiceDeps['postRepository']['getFeed']>().mockResolvedValue(Array.from({ length: 5 }, () => postForFeedRow))
      })
      const result = await api.getFeed({
        limit: 10,
        page: 1,
      }, undefined);
      expect(result).toEqual({
        data: Array.from({ length: 5 }, () => {
          const { total, ...post } = postForFeedRow;
          return post;
        }),
        meta: {
          total: postForFeedRow.total,
          page: 1,
          limit: 10,
          hasNextPage: true,
          hasPreviousPage: false
        }
      })
      expect(mockedPostRepository.getFeed).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      }, undefined);
    });
    it('should pass all query, filter params to the repository method and compute page > 1 cases correctly', async () => {
      const { api, mockedPostRepository } = makePostService({
        getFeed: jest.fn<PostServiceDeps['postRepository']['getFeed']>().mockResolvedValue(Array.from({ length: 5 }, () => postForFeedRow))
      });
      const result = await api.getFeed({
        authorId: 'AUTHOR_ID',
        categoryId: 'CATEGORY_ID',
        limit: 10,
        search: 'SEARCH',
        page: 10
      }, 'CURRENT_USER_ID');
      expect(mockedPostRepository.getFeed).toHaveBeenCalledWith({
        authorId: 'AUTHOR_ID',
        categoryId: 'CATEGORY_ID',
        limit: 10,
        search: 'SEARCH',
        offset: 90
      }, 'CURRENT_USER_ID');
      expect(result).toEqual({
        data: Array.from({ length: 5 }, () => {
          const { total, ...post } = postForFeedRow;
          return post;
        }),
        meta: {
          total: postForFeedRow.total,
          page: 10,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: true
        }
      })
    });
    it('should correctly compute total = 0 cases', async () => {
      const { api, mockedPostRepository } = makePostService({
        getFeed: jest.fn<PostServiceDeps['postRepository']['getFeed']>().mockResolvedValue([]),
      });
      const result = await api.getFeed({
        limit: 10,
        page: 1
      }, undefined);
      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          hasNextPage: false,
          hasPreviousPage: false
        }
      })
      expect(mockedPostRepository.getFeed).toHaveBeenCalledWith({
        limit: 10,
        offset: 0
      }, undefined)
    });
  });
  describe('createPost', () => {
    it('should generate slug and pass it to createPost repository method, and return the create post', async () => {
      const { api, mockedPostRepository } = makePostService({
        createPost: jest.fn<PostServiceDeps['postRepository']['createPost']>().mockResolvedValue({
          postId: 'POST_ID',
          authorId: 'AUTHOR_ID',
          categoryId: 'CATEGORY_ID',
          title: 'POST TITLE',
          slug: 'post-title',
          description: 'DESCRIPTION',
          content: 'CONTENT',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
      const post = await api.createPost({
        authorId: 'AUTHOR_ID',
        title: 'POST TITLE',
        content: 'CONTENT',
        description: 'DESCRIPTION',
        categoryId: 'CATEGORY_ID'
      })
      expect(mockedPostRepository.createPost).toHaveBeenCalledWith({
        authorId: 'AUTHOR_ID',
        title: 'POST TITLE',
        content: 'CONTENT',
        description: 'DESCRIPTION',
        categoryId: 'CATEGORY_ID',
        slug: 'post-title'
      })
      expect(post).toEqual({
        postId: 'POST_ID',
        authorId: 'AUTHOR_ID',
        categoryId: 'CATEGORY_ID',
        title: 'POST TITLE',
        slug: 'post-title',
        description: 'DESCRIPTION',
        content: 'CONTENT',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })

    })
  });
  describe('deletePost', () => {
    it('should throw NotFoundError if repo returns null', async () => {
      const { api, mockedPostRepository } = makePostService({
        deletePost: jest.fn<PostServiceDeps['postRepository']['deletePost']>().mockResolvedValue(null)
      })
      await expect(api.deletePost('POST_ID', 'AUTHOR_ID')).rejects.toThrow(NotFoundError);
      expect(mockedPostRepository.deletePost).toHaveBeenCalledWith('POST_ID', 'AUTHOR_ID');

    })
  })
});

describe('generateSlug', () => {
  it('should correctly normalize the title remove whitespace and lowercase it', () => {
    const slug = generateSlug('This is My     Title');
    expect(slug).toBe('this-is-my-title');
  })
})
