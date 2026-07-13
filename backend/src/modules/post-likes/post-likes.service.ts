import { ConflictError, NotFoundError } from "../../errors/errors.js"
import postLikesRepository from "./post-likes.repository.js"
import { PostLike } from "./post-likes.types.js"

interface PostLikeService {
  createLike(authorId: string, postId: string): Promise<PostLike>
  deleteLike(authorId: string, postId: string): Promise<PostLike>
}

const postLikeService: PostLikeService = {
  async createLike(authorId, postId) {
    const existingLike = await postLikesRepository.getLike(authorId, postId);
    if (existingLike) {
      throw new ConflictError("Like already exists");
    }
    return postLikesRepository.createLike(authorId, postId);
  },
  async deleteLike(authorId, postId) {
    const result = await postLikesRepository.deleteLike(authorId, postId);
    if (!result) {
      throw new NotFoundError("Like not found");
    }
    return result;
  }
}

export default postLikeService;
