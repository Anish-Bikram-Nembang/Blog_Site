import createPostService from "./posts.service.js";
import createPostRepository from "./posts.repository.js";
import pool from "../../database/pool.service.js";

const postRepository = createPostRepository({
  db: pool
});

const postService = createPostService({
  postRepository,
})
export default postService;
