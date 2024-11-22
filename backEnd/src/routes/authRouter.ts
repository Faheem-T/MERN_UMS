import { Router } from "express";
import {
  handle_initialCheck_get,
  handle_login_post,
  handle_logout_post,
  handle_refresh_get,
  handle_register_post,
  handle_status_get,
} from "../controllers/authController";
import { validateUserMiddleware } from "../middlewares/validateUserMiddleware";
import jwt from "jsonwebtoken";
import { verifyAccessTokenMiddleware } from "../middlewares/verifyAccessTokenMiddleware";

export const authRouter = Router()
  .post("/register", validateUserMiddleware, handle_register_post)
  .post("/login", handle_login_post)
  .get("/status", verifyAccessTokenMiddleware, handle_status_get)
  .get("/refresh", handle_refresh_get)
  .post("/logout", handle_logout_post)
  .get("/initialCheck", handle_initialCheck_get);
