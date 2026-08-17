import createAuthService from "./auth.service.js";
import userService from "../users/index.js";
import config from "../../config.js"

const authService = createAuthService({
  config,
  userService,
});

export default authService;
