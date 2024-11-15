import { Router } from "express";
import {
  handle_login_post,
  handle_refresh_get,
  handle_register_post,
  handle_status_get,
} from "../../controllers/auth/authController";
import { validateUserMiddleware } from "../../middlewares/validateUserMiddleware";
import jwt from "jsonwebtoken";

export const authRouter = Router()
  .post("/register", validateUserMiddleware, handle_register_post)
  .post("/login", handle_login_post)
  .get("/status", handle_status_get)
  .get("/refresh", handle_refresh_get);
