import { Router } from "express";
import userController from "./users.controller.js";
import attachUser from "../auth/attachUser.middleware.js";
import requireAuth from "../auth/requireAuth.middleware.js";
import authenticated from "../../shared/utils/authenticatedController.js";

const router = Router();

router.get('/me', attachUser, requireAuth, authenticated(userController.identifyUser));

export default router;
