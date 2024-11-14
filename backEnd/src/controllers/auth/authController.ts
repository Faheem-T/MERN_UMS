import { Request, Response } from "express";
import { User } from "../../ZodSchemas/userSchema";
import { UserModel } from "../../models/UserModel";
import { LoginUser } from "../../ZodSchemas/userSchema";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_LIFESPAN = 1000 * 60 * 60; // 1 minute
const ACCESS_TOKEN_LIFESPAN = 60 * 10; // 10 seconds

// Handle POST to /api/auth/register
export const handle_register_post = async (
  req: Request<{}, {}, User>,
  res: Response
) => {
  await UserModel.create({ ...req.body }).then(console.log);
  res.status(200).send("GOOD!!");
};

// Handle POST to /api/auth/login
export const handle_login_post = async (
  req: Request<{}, {}, LoginUser>,
  res: Response
) => {
  console.log(req.cookies);
  const { identifier, password } = req.body;
  let result;
  // trying with identifier == username
  try {
    result = await UserModel.findOne({ username: identifier, password });
  } catch (err) {
    console.log(err);
  }
  // trying with identifier == email
  if (!result) {
    console.log("didin't find user with username");
    result = await UserModel.findOne({ email: identifier, password });
  }
  if (!result) {
    console.log("didn't find user with email");
    res.status(404).send("Not Found");
    return;
  }

  // DO JWT SHIT HERE
  // get username and role from found user
  // use that to create the jwt refresh token
  //
  const { username, role } = result;
  const refreshToken = generateRefreshToken({ username, role });
  const accessToken = generateAccessToken({ username, role });
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict", // or 'lax' depending on your needs
      maxAge: REFRESH_TOKEN_LIFESPAN,
      path: "/",
    })
    .status(200)
    .json({ message: "Refresh Token cookie set successfully", accessToken });
  // const refreshToken = generateAccessToken();
};

interface jwtUserObject {
  username: string;
  role: "user" | "admin";
}
const generateAccessToken = (user: jwtUserObject) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return console.log("ACCESS TOKEN NOT FOUND");
  return jwt.sign(user, secret);
};
const generateRefreshToken = (user: jwtUserObject) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) return console.log("REFRESH TOKEN NOT FOUND");
  return jwt.sign(user, secret);
};
