import createUserService from "./users.service.js";
import createUserRepository from "./users.repository.js";
import pool from "../../database/pool.service.js";

const userRepository = createUserRepository({
  db: pool
})

const userService = createUserService({
  userRepository,
})
export default userService;
