import { PostLikeEntity } from "../../database/types/post-like.entity.js"
import { NotFoundError } from "../../errors/errors.js"
import { PostLikesRepository } from "./post-likes.repository.js"

export interface PostLikesService {
  createLike(authorId: string, postId: string): Promise<PostLikeEntity>
  deleteLike(authorId: string, postId: string): Promise<PostLikeEntity>
}
export interface PostLikesServiceDeps {
  postLikesRepository: {
    createLike: PostLikesRepository['createLike'];
    deleteLike: PostLikesRepository['deleteLike'];
  }
}

export default function createPostLikeService(deps: PostLikesServiceDeps): PostLikesService {
  return {
    async createLike(authorId, postId) {
      return deps.postLikesRepository.createLike(authorId, postId);
    },
    async deleteLike(authorId, postId) {
      const result = await deps.postLikesRepository.deleteLike(authorId, postId);
      if (!result) {
        throw new NotFoundError("Like not found");
      }
      return result;
    }
  }
}

