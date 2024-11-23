import { Request, Response } from "express";
import { UserInterface, UserModel } from "../models/UserModel";

// handles GET request to /api/users/
export const handle_users_get = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find({ role: "user" });
    const formattedUsers = users.map((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      pfpUrl: user.pfpUrl,
    }));
    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.log("Error while fetching users", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// handles GET request to /api/users/:id
export const handle_user_get = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error while getting user by id", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// handles DELETE request to /api/users/:id
export const handle_user_delete = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await UserModel.findByIdAndDelete(id);
    res.status(200).send();
  } catch (error) {
    console.log("Error while deleting user by id: ", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
