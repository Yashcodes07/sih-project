import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  department: { type: String }, // Only for officers
  password: { type: String },
  role: { type: String, enum: ['citizen', 'officer'], default: 'citizen' }, // New field
  createdAt: { type: Date, default: Date.now }
});

const User = models.User || model("User", userSchema, "users");
export default User;
