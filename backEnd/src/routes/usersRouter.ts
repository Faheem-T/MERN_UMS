import { Router } from "express";
import {
  handle_user_delete,
  handle_user_patch,
  handle_users_get,
  handle_users_post,
} from "../controllers/usersController";

export const usersRouter = Router()
  .get("/", handle_users_get)
  .delete("/:id", handle_user_delete)
  .patch("/:id", handle_user_patch)
  .post("/", handle_users_post);
