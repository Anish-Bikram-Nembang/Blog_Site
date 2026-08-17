import createCommentLikesService from "./comment-likes.service.js";
import createCommentLikesRepository from "./comment-likes.repository.js";
import pool from "../../database/pool.service.js";

const commentLikesRepository = createCommentLikesRepository({
  db: pool,
})

const commentLikesService = createCommentLikesService({
  commentLikesRepository,
});
export default commentLikesService;
