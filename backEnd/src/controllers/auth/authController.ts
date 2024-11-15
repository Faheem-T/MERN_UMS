import { Request, Response } from "express";
import { User } from "../../ZodSchemas/userSchema";
import { UserModel } from "../../models/UserModel";
import { LoginUser } from "../../ZodSchemas/userSchema";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { RefreshTokenModel } from "../../models/RefreshTokenModel";
import { compareWithHash, generateHash } from "../../utils/hashUtils";

const REFRESH_TOKEN_LIFESPAN = 1000 * 60; // 1 minute
const ACCESS_TOKEN_LIFESPAN = 60; // in seconds

interface jwtUserObject {
  // username: string;
  // role: "user" | "admin";
  _id: mongoose.Types.ObjectId;
}

interface JwtPayload extends jwtUserObject {
  iat: number;
  exp: number;
}

// Handle POST to /api/auth/register
export const handle_register_post = async (
  req: Request<{}, {}, User>,
  res: Response
) => {
  req.body.password = generateHash(req.body.password);
  await UserModel.create({ ...req.body }).then(console.log);
  res.status(200).json("GOOD!!");
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
    result = await UserModel.findOne({ username: identifier });
  } catch (err) {
    console.log(err);
  }
  // trying with identifier == email
  if (!result) {
    console.log("didin't find user with username");
    try {
      result = await UserModel.findOne({ email: identifier });
    } catch (error) {
      console.log(error);
    }
  }
  if (!result) {
    console.log("didn't find user with email");
    res.status(404).json("User Not Found");
    return;
  }

  if (!compareWithHash(password, result.password)) {
    console.log(password);
    console.log(result.password);
    console.log("incorrect password");
    res.status(401).json("Incorrect Password");
    return;
  }

  // get username and role from found user
  // use that to create the jwt refresh token

  // decided to use just the _id for signin tokens
  const { username, role, _id } = result;
  const refreshToken = generateRefreshToken({ _id });
  // adding refresh token to DB
  await RefreshTokenModel.create({ refreshToken, userId: _id });
  const accessToken = generateAccessToken({ _id });
  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      path: "/",
    })
    .status(200)
    .json({
      message: "Refresh Token cookie set successfully",
      accessToken,
      user: result,
    });
  // const refreshToken = generateAccessToken();
};

const generateAccessToken = (user: jwtUserObject) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return console.log("ACCESS TOKEN NOT FOUND");
  return jwt.sign(user, secret, { expiresIn: ACCESS_TOKEN_LIFESPAN });
};
const generateRefreshToken = (user: jwtUserObject) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) return console.log("REFRESH TOKEN NOT FOUND");
  return jwt.sign(user, secret, { expiresIn: "30d" });
};

// handle GET to /api/auth/status
export const handle_status_get = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1]; // Removes "Bearer " prefix

  if (!accessToken) {
    res.status(401).json({ message: "No access token provided" });
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(401);
    console.log("Access token secret not found");
    return;
  }
  try {
    jwt.verify(accessToken, accessTokenSecret);
    res.status(200).json({ message: "Token is Valid!" });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// function that handles access token refresh requests
export const handle_refresh_get = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: "No refresh token provided" });
    console.log("No refresh token provided");
    return;
  }

  // checking for refresh token in database
  const foundToken = await RefreshTokenModel.findOne({ refreshToken });
  if (!foundToken) {
    res.status(401).json({ message: "Invalid refresh token" });
    console.log("token not in db");
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  if (!accessTokenSecret || !refreshTokenSecret) {
    console.error("token secret not found");
    res.status(401);
    return;
  }

  try {
    // decoded will be the user that was used to sign the token
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;
    const { _id } = decoded;
    const newAccessToken = jwt.sign({ _id }, accessTokenSecret, {
      expiresIn: ACCESS_TOKEN_LIFESPAN,
    });
    const foundUser = await UserModel.findById(_id);
    res.status(201).json({ accessToken: newAccessToken, user: foundUser });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid refresh token" });
    console.log("Invalid refresh token");
    console.log(typeof refreshToken);
    console.log(typeof refreshTokenSecret);
  }
};
