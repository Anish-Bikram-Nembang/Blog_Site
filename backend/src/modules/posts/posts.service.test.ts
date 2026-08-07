import { describe, it, expect, jest, afterEach, beforeAll } from '@jest/globals';
import { ConflictError, ForbiddenError, NotFoundError } from '../../errors/errors.js';

// ─────────────────────────────────────────────────────────────────────────
// WHY jest.unstable_mockModule() instead of jest.mock():
// Under CommonJS, jest.mock('./x.js') works because Jest can hoist the call
// above imports and hijack Node's `require` cache before postService ever
// requires postRepository. Under native ESM (which this project uses, per
// "type": "module" in package.json), modules are resolved and linked by the
// JS engine itself before Jest's transform ever runs, so there's no require
// cache to hijack — plain jest.mock() silently does nothing, which is why
// postRepository.getFeed was still the REAL function (no .mockResolvedValue).
//
// jest.unstable_mockModule() registers the mock in a way ESM's module loader
// respects, but it only takes effect for modules imported AFTER it's called.
// That's why postService and postRepository are no longer imported at the
// top of the file with static `import` — they're imported dynamically below,
// inside beforeAll, using `await import(...)`, guaranteeing the mock is
// registered first.
// ─────────────────────────────────────────────────────────────────────────
jest.unstable_mockModule('./posts.repository.js', () => ({
  default: {
    getFeed: jest.fn(),
    createPost: jest.fn(),
    deletePost: jest.fn(),
    getPostById: jest.fn(),
    getPostBySlug: jest.fn(),
  },
}));

// `let` because these are assigned inside beforeAll, after the mock above
// is registered.
//
// WHY jest.Mocked<T> on postRepository specifically:
// jest.fn() with no type arguments is inferred as Mock<UnknownFunction>,
// which makes TS treat its `.mockResolvedValue(...)` parameter as `never`
// (TS has no idea what type the mock is supposed to resolve to, so it picks
// the emptiest possible type). jest.Mocked<T> takes the REAL repository's
// type and rewrites every method's type to be "a jest mock function with
// this same signature" — so `getFeed` is now known to be
// `jest.Mock<(args) => Promise<Feed>>`, and `.mockResolvedValue` correctly
// expects a `Feed`, not `never`. This only affects TYPES; it doesn't change
// what jest.unstable_mockModule actually returns at runtime.
let postService: typeof import('./posts.service.js')['default'];
let postRepository: jest.Mocked<typeof import('./posts.repository.js')['default']>;

beforeAll(async () => {
  // Dynamic import happens here, AFTER jest.unstable_mockModule has run,
  // so postService receives the MOCKED postRepository when it imports it
  // internally — not the real one.
  postService = (await import('./posts.service.js')).default;
  postRepository = (await import('./posts.repository.js')).default as jest.Mocked<
    typeof import('./posts.repository.js')['default']
  >;
});

describe('postService', () => {

  // WHY: mocks remember every call across tests unless cleared. Without this,
  // a mockResolvedValue set in test A can "leak" into test B and give you a
  // false pass or a confusing failure. Always reset between tests.
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ───────────────────────────────────────────────────────────────────────
  describe('getFeed', () => {
    // WHY this test: getFeed does a small but easy-to-break piece of math —
    // converting a 1-indexed "page" into a 0-indexed "offset" for SQL LIMIT/OFFSET.
    // This is exactly the kind of arithmetic that's silently wrong off-by-one
    // and only shows up as "page 2 looks the same as page 1" in manual testing.
    it('converts page number to correct offset (page 1 -> offset 0)', async () => {
      postRepository.getFeed.mockResolvedValue({ data: [], total: 0 });

      await postService.getFeed({ limit: 10, page: 1 });

      // WHY toHaveBeenCalledWith: we're not checking the RETURN value here,
      // we're checking that postService called the repository with the right
      // ARGUMENTS. This is how you unit test "did my logic transform the
      // input correctly before handing it off" without touching real SQL.
      expect(postRepository.getFeed).toHaveBeenCalledWith({
        limit: 10,
        offset: 0, // page 1 => no rows skipped
        search: undefined,
        authorId: undefined,
        categoryId: undefined,
      });
    });

    it('converts page number to correct offset (page 3, limit 10 -> offset 20)', async () => {
      postRepository.getFeed.mockResolvedValue({ data: [], total: 0 });

      await postService.getFeed({ limit: 10, page: 3 });

      expect(postRepository.getFeed).toHaveBeenCalledWith(
        expect.objectContaining({ offset: 20 }) // expect.objectContaining: only check the field we care about
      );
    });

    it('shapes the repository result into { data, meta }', async () => {
      const fakeRows = [{ postId: '1', title: 'Test Post', authorName: 'Alice', categoryName: 'Tech', likes: 3, authorId: 'Numvberrr', categoryId: 'Numvberrr', slug: 'test-post', description: 'desc', createdAt: new Date(), updatedAt: new Date() }];
      postRepository.getFeed.mockResolvedValue({ data: fakeRows, total: 42 });

      const result = await postService.getFeed({ limit: 10, page: 2 });

      // WHY toEqual (not toBe): toBe checks reference equality (===), which
      // fails for objects/arrays even if their contents match. toEqual does a
      // deep structural comparison — the right tool whenever comparing objects.
      expect(result).toEqual({
        data: fakeRows,
        meta: { total: 42, page: 2, limit: 10 },
      });
    });

    it('passes optional filters through untouched when provided', async () => {
      postRepository.getFeed.mockResolvedValue({ data: [], total: 0 });

      await postService.getFeed({
        limit: 5,
        page: 1,
        search: 'dragons',
        authorId: 'author-1',
        categoryId: 'cat-1',
      });

      expect(postRepository.getFeed).toHaveBeenCalledWith({
        limit: 5,
        offset: 0,
        search: 'dragons',
        authorId: 'author-1',
        categoryId: 'cat-1',
      });
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  describe('createPost', () => {
    const payload = {
      title: 'My First Post',
      description: 'desc',
      content: 'content',
      categoryId: 'cat-1',
    } as any; // `as any` here only because CreatePostRequest isn't shown; use the real type in your codebase

    it('creates the post when no slug conflict exists', async () => {
      postRepository.getPostBySlug.mockResolvedValue(null); // no existing post
      postRepository.createPost.mockResolvedValue({ postId: '1', ...payload, slug: 'my-first-post' });

      const result = await postService.createPost(payload);

      // WHY check the slug specifically: generateSlug is a pure transform
      // (title -> slug) living inside this file. We're implicitly testing it
      // here through createPost's behavior, by asserting the repository was
      // called with the slug we expect it to have generated.
      expect(postRepository.createPost).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'my-first-post' })
      );
      expect(result.slug).toBe('my-first-post');
    });

    it('throws ConflictError when a post with the generated slug already exists', async () => {
      postRepository.getPostBySlug.mockResolvedValue({ postId: 'existing-post' }); // slug taken

      // WHY the function-wrapper `() => postService.createPost(payload)`:
      // expect(...).rejects needs a PROMISE to inspect, not an already-resolved
      // or already-rejected value. If we wrote
      //   expect(postService.createPost(payload)).rejects.toThrow(...)
      // it would still technically work here, but wrapping in an arrow
      // function is the safer habit — it guarantees the promise is created
      // fresh at the moment Jest awaits it, not before.
      await expect(postService.createPost(payload)).rejects.toThrow(ConflictError);

      // WHY assert createPost was NEVER called: this is the important second
      // half of the test. It's not enough that an error was thrown — we also
      // want to prove the service stopped BEFORE attempting to write a
      // duplicate row. This catches bugs where an error is thrown but the
      // write happens anyway (e.g. wrong control flow, missing `return`).
      expect(postRepository.createPost).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  describe('deletePost', () => {
    // NOTE: as written, postService.deletePost checks `post.authorId !== authorId`
    // BEFORE checking `if (!post)`. If the post doesn't exist, `post` is null,
    // and `post.authorId` throws a TypeError — not NotFoundError.
    // The test below asserts the INTENDED behavior (404 when missing). It will
    // fail against the current code until the null-check is moved above the
    // ownership check. That failure is the test doing its job.

    it('throws NotFoundError when the post does not exist', async () => {
      postRepository.getPostById.mockResolvedValue(null);

      await expect(postService.deletePost('post-1', 'user-1')).rejects.toThrow(NotFoundError);
      expect(postRepository.deletePost).not.toHaveBeenCalled();
    });

    it('throws ForbiddenError when the requester does not own the post', async () => {
      postRepository.getPostById.mockResolvedValue({
        postId: 'post-1',
        authorId: 'someone-else',
      });

      await expect(postService.deletePost('post-1', 'user-1')).rejects.toThrow(ForbiddenError);
      expect(postRepository.deletePost).not.toHaveBeenCalled();
    });

    it('deletes the post when the requester is the owner', async () => {
      postRepository.getPostById.mockResolvedValue({
        postId: 'post-1',
        authorId: 'user-1',
      });
      postRepository.deletePost.mockResolvedValue(undefined);

      await postService.deletePost('post-1', 'user-1');

      expect(postRepository.deletePost).toHaveBeenCalledWith('post-1');
    });
  });

  // ───────────────────────────────────────────────────────────────────────
  // getPostById and getPostBySlug share the exact same shape of logic
  // (fetch -> throw NotFoundError if null -> return). Testing both is NOT
  // redundant even though the logic looks identical: they call DIFFERENT
  // repository methods, and a future edit to one but not the other (e.g.
  // someone "fixes" getPostById and forgets getPostBySlug) is a real class
  // of bug. Cheap tests, real protection.
  describe('getPostById', () => {
    it('returns the post when found', async () => {
      const fakePost = { postId: '1', title: 'Found Post' };
      postRepository.getPostById.mockResolvedValue(fakePost);

      const result = await postService.getPostById('1');

      expect(result).toEqual(fakePost);
    });

    it('throws NotFoundError when the post does not exist', async () => {
      postRepository.getPostById.mockResolvedValue(null);

      await expect(postService.getPostById('missing')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPostBySlug', () => {
    it('returns the post when found', async () => {
      const fakePost = { postId: '1', slug: 'found-post' };
      postRepository.getPostBySlug.mockResolvedValue(fakePost);

      const result = await postService.getPostBySlug('found-post');

      expect(result).toEqual(fakePost);
    });

    it('throws NotFoundError when no post matches the slug', async () => {
      postRepository.getPostBySlug.mockResolvedValue(null);

      await expect(postService.getPostBySlug('missing-slug')).rejects.toThrow(NotFoundError);
    });
  });
});
