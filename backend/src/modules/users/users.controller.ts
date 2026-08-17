import { Response } from "express";
import userService from "./users.service.instance.js";
import { UnauthorizedError } from "../../errors/errors.js";
import { AuthenticatedRequest } from "../auth/auth.types.js";

const userController = {
  async identifyUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.user.userId;
    const result = await userService.findUserById(userId);
    if (!result) {
      throw new UnauthorizedError();
    }
    res.status(200).json(result);
  }
}
export default userController;
