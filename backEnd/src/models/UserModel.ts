import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  username: Schema.Types.String,
  password: Schema.Types.String,
  email: Schema.Types.String,
});

export const UserModel = model("user", UserSchema);
