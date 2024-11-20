import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyAccessTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1]; // Removes "Bearer " prefix

  if (!accessToken) {
    res.status(403).json({ success: false, message: "Invalid token" });
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log("Access token secret not found");
    return;
  }
  try {
    jwt.verify(accessToken, accessTokenSecret);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};
