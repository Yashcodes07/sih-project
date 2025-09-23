import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Officer from "@/models/Officer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, department, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if email exists in officers collection
    const existingOfficer = await Officer.findOne({ email: email.trim().toLowerCase() });
    
    if (existingOfficer) {
      // This is an officer registration
      if (!department) {
        return NextResponse.json({ error: "Department is required for officers" }, { status: 400 });
      }

      // 🔧 FIXED: Check if already has password (already registered)
      if (existingOfficer.password) {
        return NextResponse.json({ error: "Already registered, please log in" }, { status: 400 });
      }

      // Generate OTP for new officer registration
      const otp = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);
      const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

      // Update pre-existing officer record
      existingOfficer.name = name;
      existingOfficer.department = department;
      existingOfficer.password = await bcrypt.hash(password, 10);
      existingOfficer.otp_hash = otpHash;
      existingOfficer.otp_expires = otpExpires;
      existingOfficer.otp_attempts = 0;
      existingOfficer.is_verified = false; // Will be set to true after OTP verification
      await existingOfficer.save();

      // In production, send email with OTP here
      if (!process.env.DEMO_OTP) {
        console.log(`OTP for ${email}: ${otp}`);
      }

      return NextResponse.json({ 
        message: "Registration successful! Please verify OTP.", 
        role: "officer",
        requiresOTP: true
      });
    }

    // Check if already registered as citizen
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Register as citizen
    const otp = process.env.DEMO_OTP || Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'citizen',
      otp_hash: otpHash,
      otp_expires: otpExpires,
      otp_attempts: 0,
      is_verified: false // Will be set to true after OTP verification
    });

    await newUser.save();

    // In production, send email with OTP here
    if (!process.env.DEMO_OTP) {
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({ 
      message: "Registration successful! Please verify OTP.", 
      role: "citizen",
      requiresOTP: true
    });

  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
