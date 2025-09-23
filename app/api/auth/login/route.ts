import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Officer from "@/models/Officer";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check officers collection first
    const officer = await Officer.findOne({ email: email.trim().toLowerCase() });
    
    if (officer && officer.password) {
      const isValid = await bcrypt.compare(password, officer.password);
      if (isValid) {
        // 🔧 FIXED: Check if already verified
        if (officer.is_verified) {
          // Already verified officer - can login directly with NextAuth
          return NextResponse.json({ 
            message: "Login successful!",
            role: "officer",
            verified: true // This will trigger direct NextAuth login
          });
        } else {
          // Need OTP verification for first-time login
          const otp = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
          const otpHash = await bcrypt.hash(otp, 10);
          const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

          officer.otp_hash = otpHash;
          officer.otp_expires = otpExpires;
          officer.otp_attempts = 0;
          await officer.save();

          // In production, send email with OTP here
          if (!process.env.DEMO_OTP) {
            console.log(`Login OTP for ${email}: ${otp}`);
          }

          return NextResponse.json({ 
            message: "Please verify OTP to complete login.",
            role: "officer",
            requiresOTP: true
          });
        }
      }
    }

    // Check users collection
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (user && user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        // 🔧 FIXED: Check if already verified
        if (user.is_verified) {
          // Already verified user - can login directly with NextAuth
          return NextResponse.json({ 
            message: "Login successful!",
            role: user.role || "citizen",
            verified: true // This will trigger direct NextAuth login
          });
        } else {
          // Need OTP verification for first-time login
          const otp = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
          const otpHash = await bcrypt.hash(otp, 10);
          const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

          user.otp_hash = otpHash;
          user.otp_expires = otpExpires;
          user.otp_attempts = 0;
          await user.save();

          // In production, send email with OTP here
          if (!process.env.DEMO_OTP) {
            console.log(`Login OTP for ${email}: ${otp}`);
          }

          return NextResponse.json({ 
            message: "Please verify OTP to complete login.",
            role: user.role || "citizen",
            requiresOTP: true
          });
        }
      }
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
