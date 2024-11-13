import { Router } from "express";
import { handle_register_post } from "../../controllers/auth/authController";
import { validateUserMiddleware } from "../../middlewares/validateUserMiddleware";

export const authRouter = Router().post(
  "/register",
  validateUserMiddleware,
  handle_register_post
);
