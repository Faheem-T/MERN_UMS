import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";

export const handle_users_get = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({ role: "user" });
    res.status(200).json({ users });
  } catch (error) {
    console.log("Error while fetching users", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
