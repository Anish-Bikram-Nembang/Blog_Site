import { Request, Response } from "express";
import userService from "./users.service.instance.js";
import { UnauthorizedError } from "../../errors/errors.js";

const userController = {
  async identifyUser(req: Request, res: Response) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError();
    }
    const result = await userService.findUserById(userId);
    if (!result) {
      throw new UnauthorizedError();

    }
    res.status(200).json(result);
  }
}
export default userController;
