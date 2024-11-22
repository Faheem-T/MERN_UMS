import { Router } from "express";
import { handle_pfpUpload_post } from "../controllers/pfpController";
import { verifyAccessTokenMiddleware } from "../middlewares/verifyAccessTokenMiddleware";

export const pfpRouter = Router().post(
  "/upload",
  verifyAccessTokenMiddleware,
  handle_pfpUpload_post
);
