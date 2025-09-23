// app/api/auth/complete-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Officer from "@/models/Officer";

export async function POST(req: NextRequest) {
  try {
    const { email, type, role, aadhaar } = await req.json();
    if (!email || !type || !role) {
      return NextResponse.json({ error: "Email, type and role are required" }, { status: 400 });
    }
    if (role === 'officer' && (!aadhaar || aadhaar.length !== 12)) {
      return NextResponse.json({ error: "Valid Aadhaar required for officers" }, { status: 400 });
    }
    await connectToDatabase();
    const target = role === 'officer'
      ? await Officer.findOne({ email: email.toLowerCase() })
      : await User.findOne({ email: email.toLowerCase() });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // mark verified
    target.otp_hash = undefined;
    target.otp_expires = undefined;
    target.otp_attempts = 0;
    target.is_verified = true;
    if (role === 'officer') {
      const aadhaarHash = await bcrypt.hash(aadhaar, 10);
      target.aadhaar_ref = aadhaarHash;
      target.aadhaar_verified = true;
    }
    await target.save();
    return NextResponse.json({ message: "Verification complete", role });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
