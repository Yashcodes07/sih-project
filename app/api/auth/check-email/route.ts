import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Officer from "@/models/Officer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if email exists in officers collection
    const officer = await Officer.findOne({ email: email.trim().toLowerCase() });

    return NextResponse.json({ 
      isOfficer: !!officer,
      exists: !!officer 
    });

  } catch (err: any) {
    console.error("EMAIL CHECK ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
