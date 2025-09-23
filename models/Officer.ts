import mongoose, { Schema, model, models } from "mongoose";

const officerSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  password: { type: String },
  
  // OTP fields
  otp_hash: { type: String }, // Hashed OTP
  otp_expires: { type: Date }, // OTP expiry time
  otp_attempts: { type: Number, default: 0 }, // Failed attempts
  
  // Aadhaar fields (demo mode)
  aadhaar_ref: { type: String }, // Encrypted/hashed Aadhaar reference
  aadhaar_verified: { type: Boolean, default: false },
  
  // Account activation
  is_verified: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

const Officer = models.Officer || model("Officer", officerSchema, "officers");
export default Officer;
