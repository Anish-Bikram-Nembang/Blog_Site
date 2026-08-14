import createUserService from "./users.service.js";
import userRepository from "./users.repository.js";

const userService = createUserService({
  userRepository,
})

export default userService;
