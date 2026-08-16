import createPostService from "./posts.service.js";
import postRepository from "./posts.repository.js";

const postService = createPostService({
  postRepository,
})

export default postService;
