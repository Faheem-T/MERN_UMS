import { NextFunction, Request, Response } from "express";
import { User, userSchema } from "../ZodSchemas/userSchema";
import { UserModel } from "../models/UserModel";

export const validateUserMiddleware = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;
  const { success, data, error } = userSchema.safeParse(user);
  if (success) {
    res.send(data);
    await UserModel.create({ ...data }).then(console.log);
  } else res.status(401).send(error.issues);
  console.log(success, data, error);
};
