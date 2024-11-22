import { Request, Response } from "express";
import { User } from "../ZodSchemas/userSchema";
import { UserModel } from "../models/UserModel";
import { LoginUser } from "../ZodSchemas/userSchema";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { RefreshTokenModel } from "../models/RefreshTokenModel";
import { compareWithHash, generateHash } from "../utils/hashUtils";

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
  try {
    const { email, username, password } = req.body;
    // Checking if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
      return;
    }
    const hashedPassword = generateHash(password);
    const user = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Handle POST to /api/auth/login
export const handle_login_post = async (
  req: Request<{}, {}, LoginUser>,
  res: Response
) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({
      success: false,
      message: "Indentifier and password are required",
    });
    return;
  }

  try {
    const user = await UserModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid username / email",
      });
      return;
    } else if (!compareWithHash(password, user.password)) {
      res.status(401).json({
        success: false,
        message: "Wrong password",
      });
      return;
    }
    // TODO: Check if user already has an accessToken
    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });

    // Save refresh token in DB
    await RefreshTokenModel.create({ refreshToken, userId: user._id });
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            pfpUrl: user.pfpUrl,
          },
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
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
export const handle_status_get = async (req: Request, res: Response) => {
  res.json({ success: true, message: "Authenticated!" });
};

// function that handles access token refresh requests
export const handle_refresh_get = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(401)
      .json({ success: false, message: "Refresh token is required" });
    console.log("No refresh token provided");
    return;
  }

  // checking for refresh token in database
  try {
    const foundToken = await RefreshTokenModel.findOne({ refreshToken });
    if (!foundToken) {
      res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
      console.log("token not in db");
      return;
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;

    const newAccessToken = generateAccessToken({ _id: decoded._id });
    const newRefreshToken = generateRefreshToken({ _id: decoded._id });
    if (!newRefreshToken) {
      console.log("Did not create refresh token");
      return;
    }
    foundToken.refreshToken = newRefreshToken;
    await foundToken.save();

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .status(201)
      .json({
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
  } catch (error: any) {
    console.log("Error during token refresh:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error during token refresh",
    });
  }
};

// handle POST to /api/auth/logout
export const handle_logout_post = async (req: Request, res: Response) => {
  try {
    await RefreshTokenModel.findOneAndDelete({
      refreshToken: req.cookies.refreshToken,
    });
  } catch (error) {
    console.log("Error deleting refresh token from database");
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
    return;
  }
  res.clearCookie("refreshToken", { path: "/" }).status(200).json({
    message: "Refresh Token deleted",
    accessToken: null,
    user: null,
  });
};

// handle GET to /api/auth/initialCheck
// this is the endpoint that is first requested
// by the front end.
// if a valid refresh token is found, user
// details and access token will be sent back.
export const handle_initialCheck_get = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(401)
      .json({ success: false, message: "Refresh token is required" });
    console.log("No refresh token provided");
    return;
  }

  // checking for refresh token in database
  try {
    const foundToken = await RefreshTokenModel.findOne({ refreshToken });
    if (!foundToken) {
      res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
      console.log("token not in db");
      return;
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as JwtPayload;

    const newAccessToken = generateAccessToken({ _id: decoded._id });
    const newRefreshToken = generateRefreshToken({ _id: decoded._id });
    if (!newRefreshToken) {
      console.log("Did not create refresh token");
      return;
    }
    foundToken.refreshToken = newRefreshToken;
    await foundToken.save();

    // generating user
    const user = await UserModel.findById(decoded._id);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .status(201)
      .json({
        success: true,
        data: {
          accessToken: newAccessToken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            pfpUrl: user.pfpUrl,
          },
        },
      });
  } catch (error: any) {
    console.log("Error during token refresh:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error during token refresh",
    });
  }
};
