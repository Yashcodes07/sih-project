import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  department: { type: String},
  password: { type: String},
});

const User = models.User || model("User", userSchema, "users");
export default User;
