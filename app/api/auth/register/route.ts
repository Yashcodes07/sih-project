import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, department, password } = await req.json();
    if (!name || !email || !department || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    await connectToDatabase();
    const allUsers = await User.find({});
    console.log('ALL USER EMAILS:', allUsers.map(u => u.email));
    console.log('LOOKUP EMAIL:', email.trim().toLowerCase());
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    console.log("Queried for:", email, "Result:", user);

    if (!user) {
      return NextResponse.json({ error: "This email is not authorized to register" }, { status: 403 });
    }
    if (user.password) {
      return NextResponse.json({ error: "Already registered, please log in" }, { status: 400 });
    }
    // Update pre-existing blank user
    user.name = name;
    user.department = department;
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    return NextResponse.json({ message: "Registration successful! Please login." });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
