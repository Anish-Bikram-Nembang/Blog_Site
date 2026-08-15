import postLikesRepository from "./post-likes.repository.js";
import createPostLikeService from "./post-likes.service.js";

const postLikesService = createPostLikeService({
  postLikesRepository,
})

export default postLikesService;
