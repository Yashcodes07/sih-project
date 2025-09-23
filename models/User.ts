import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  department: { type: String }, // Only for officers
  password: { type: String },
  role: { type: String, enum: ['citizen', 'officer'], default: 'citizen' },
  
  // New OTP fields
  otp_hash: { type: String }, // Hashed OTP
  otp_expires: { type: Date }, // OTP expiry time
  otp_attempts: { type: Number, default: 0 }, // Failed attempts
  
  // Account activation
  is_verified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

const User = models.User || model("User", userSchema, "users");
export default User;
