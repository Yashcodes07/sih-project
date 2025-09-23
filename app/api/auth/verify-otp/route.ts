import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Officer from "@/models/Officer";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, type } = await req.json();

    if (!email || !otp || !type) {
      return NextResponse.json({ error: "Email, OTP and type are required" }, { status: 400 });
    }

    if (otp.length !== 6) {
      return NextResponse.json({ error: "OTP must be 6 digits" }, { status: 400 });
    }

    // 🔧 CRITICAL FIX: Check for demo OTP first!
    if (process.env.DEMO_OTP && otp === process.env.DEMO_OTP) {
      return NextResponse.json({ 
        message: "OTP verified successfully",
        role: email.includes("@city.gov.in") ? "officer" : "citizen" // Simple role detection
      });
    }

    await connectToDatabase();

    // Find user in both collections
    const officer = await Officer.findOne({ email: email.trim().toLowerCase() });
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    const targetUser = officer || user;
    
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if OTP has expired
    if (!targetUser.otp_expires || new Date() > targetUser.otp_expires) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Check attempt limit
    if (targetUser.otp_attempts >= 3) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    // Verify OTP
    if (!targetUser.otp_hash) {
      return NextResponse.json({ error: "No OTP found" }, { status: 400 });
    }

    const isValidOTP = await bcrypt.compare(otp, targetUser.otp_hash);

    if (!isValidOTP) {
      // Increment failed attempts
      targetUser.otp_attempts += 1;
      await targetUser.save();
      
      return NextResponse.json({ 
        error: "Invalid OTP", 
        attemptsLeft: 3 - targetUser.otp_attempts 
      }, { status: 400 });
    }

    // OTP is valid
    return NextResponse.json({ 
      message: "OTP verified successfully",
      role: officer ? "officer" : "citizen"
    });

  } catch (err: any) {
    console.error("VERIFY OTP ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
