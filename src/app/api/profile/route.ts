export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const profile = await Profile.findOne({});
    
    // Return empty array defaults if no profile exists yet
    if (!profile) {
      return NextResponse.json({ education: [], experience: [], skills: [] });
    }
    
    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    let profile = await Profile.findOne({});
    if (profile) {
      profile.education = body.education;
      profile.experience = body.experience;
      profile.skills = body.skills;
      await profile.save();
    } else {
      profile = await Profile.create(body);
    }
    
    return NextResponse.json(profile, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
