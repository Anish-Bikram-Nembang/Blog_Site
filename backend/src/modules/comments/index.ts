import createCommentService from "./comments.service.js";
import createCommentRepository from "./comments.repository.js";
import pool from "../../database/pool.service.js";

const commentRepository = createCommentRepository({
  db: pool
});

const commentService = createCommentService({
  commentRepository,
});
export default commentService;
