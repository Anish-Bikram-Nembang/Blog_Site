import createAuthService from "./auth.service.js";
import userService from "../users/users.service.instance.js";
import config from "../../config.js"

const authService = createAuthService({
  config,
  userService,
});

export default authService;
