import pool from "../../database/pool.service.js";
import createPostLikesRepository from "./post-likes.repository.js";
import createPostLikeService from "./post-likes.service.js";

const postLikesRepository = createPostLikesRepository({
  db: pool
})

const postLikesService = createPostLikeService({
  postLikesRepository,
})
export default postLikesService;
