import { Router } from "express";
import {
  handle_login_post,
  handle_register_post,
} from "../../controllers/auth/authController";
import { validateUserMiddleware } from "../../middlewares/validateUserMiddleware";

export const authRouter = Router()
  .post("/register", validateUserMiddleware, handle_register_post)
  .post("/login", handle_login_post)
  .get("/status", (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies.accessToken);
  });
