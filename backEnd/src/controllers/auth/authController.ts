import { Request, Response } from "express";
import { User } from "../../ZodSchemas/userSchema";

// Handle POST to /api/auth/register
export const handle_register_post = (
  req: Request<{}, {}, User>,
  res: Response
) => {
  const { username, password, email } = req.body;
  console.log(username, password, email);
  res.status(200).send("GOOD!!");
};
