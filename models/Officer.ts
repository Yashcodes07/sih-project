import mongoose, { Schema, model, models } from "mongoose";

const officerSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Officer = models.Officer || model("Officer", officerSchema, "officers");
export default Officer;
