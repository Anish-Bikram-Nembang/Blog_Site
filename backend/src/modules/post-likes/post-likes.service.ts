import { ConflictError, NotFoundError } from "../../utils/errors.js"
import postLikesRepository from "./post-likes.repository.js"
import { PostLike } from "./post-likes.types.js"

interface PostLikeService {
  createLike(userId: string, postId: string): Promise<PostLike>
  deleteLike(userId: string, postId: string): Promise<PostLike>
}

const postLikeService: PostLikeService = {
  async createLike(userId, postId) {
    const existingLike = await postLikesRepository.getLike(userId, postId);
    if (existingLike) {
      throw new ConflictError("Like already exists");
    }
    return postLikesRepository.createLike(userId, postId);
  },
  async deleteLike(userId, postId) {
    const result = await postLikesRepository.deleteLike(userId, postId);
    if (!result) {
      throw new NotFoundError("Like not found");
    }
    return result;
  }
}

export default postLikeService;
