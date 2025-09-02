import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // هش‌شده
  },
  { timestamps: true }
);

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

export default models.User || model("User", UserSchema);
