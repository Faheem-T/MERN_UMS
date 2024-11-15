import mongoose, { model, Schema } from "mongoose";

const RefreshTokenSchema = new Schema({
  refreshToken: {
    type: Schema.Types.String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

export interface RefreshTokenInterface {
  refreshToken: string;
  userId: mongoose.Types.ObjectId;
}

export const RefreshTokenModel = model<RefreshTokenInterface>(
  "RefreshToken",
  RefreshTokenSchema
);
