import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: Schema.Types.String,
  password: Schema.Types.String,
  email: Schema.Types.String,
  role: {
    type: Schema.Types.String,
    default: "user",
  },
});

export interface UserInterface {
  username: string;
  password: string;
  email: string;
  role: "user" | "admin";
}

export const UserModel = model<UserInterface>("user", UserSchema);
