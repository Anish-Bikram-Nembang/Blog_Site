import createCommentService from "./comments.service.js";
import commentRepository from "./comments.repository.js";

const commentService = createCommentService({
  commentRepository,
})

export default commentService;
