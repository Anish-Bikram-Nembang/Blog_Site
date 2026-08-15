import { Router } from "express";
import userController from "./users.controller.js";

const router = Router();

router.get('/me', userController.identifyUser);

export default router;
