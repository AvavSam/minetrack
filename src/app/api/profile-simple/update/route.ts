import { NextResponse } from "next/server";

// Simple in-memory store
const profiles = new Map();

export async function POST(request) {
  try {
    // Get profile data from request
    const profileData = await request.json();

    // Basic validation
    if (!profileData.name || !profileData.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Generate a unique ID if needed (typically would come from the session)
    const userId = profileData.id || `user-${Date.now()}`;

    // Store the profile data
    profiles.set(userId, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });

    console.log("Updated profile:", profiles.get(userId));

    // Return success
    return NextResponse.json({
      success: true,
      user: profiles.get(userId),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
