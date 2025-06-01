import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/react";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    // Get current session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }
    
    // Get profile data from request
    const profileData = await request.json();
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Update the user in the database (assuming users collection exists)
    const result = await db.collection("users").updateOne(
      { email: session.user.email }, // Identifier
      { 
        $set: {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          company: profileData.company,
          address: profileData.address,
          bio: profileData.bio,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      // If no document matched (user not found), create one
      await db.collection("users").insertOne({
        email: session.user.email,
        name: profileData.name,
        phone: profileData.phone,
        company: profileData.company,
        address: profileData.address,
        bio: profileData.bio,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Profil berhasil diperbarui"
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil" },
      { status: 500 }
    );
  }
}
