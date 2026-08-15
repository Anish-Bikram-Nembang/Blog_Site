import createCommentLikesService from "./comment-likes.service.js";
import commentLikesRepository from "./comment-likes.repository.js";

const commentLikesService = createCommentLikesService({
  commentLikesRepository,
});
export default commentLikesService;
