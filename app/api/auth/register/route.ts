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

      if (existingOfficer.password) {
        return NextResponse.json({ error: "Already registered, please log in" }, { status: 400 });
      }

      // Update pre-existing officer record
      existingOfficer.name = name;
      existingOfficer.department = department;
      existingOfficer.password = await bcrypt.hash(password, 10);
      await existingOfficer.save();

      return NextResponse.json({ 
        message: "Successfully registered as an officer!", 
        role: "officer" 
      });
    }

    // Check if already registered as citizen
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Register as citizen
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'citizen'
    });

    await newUser.save();

    return NextResponse.json({ 
      message: "Successfully registered as a citizen!", 
      role: "citizen" 
    });

  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}