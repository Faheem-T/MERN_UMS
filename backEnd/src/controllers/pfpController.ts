import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";
import mongoose from "mongoose";

export const handle_pfpUpload_post = async (req: Request, res: Response) => {
  const { pfpUrl, userId } = req.body;

  const id = new mongoose.Types.ObjectId(userId);
  console.log(`User ID: `, id);
  try {
    await UserModel.findByIdAndUpdate(id, {
      pfpUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }

  res
    .status(200)
    .json({ success: true, message: "Profile picture changed successfully" });
};
