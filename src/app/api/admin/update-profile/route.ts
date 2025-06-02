import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Tidak memiliki izin" },
        { status: 401 }
      );
    }

    // Get profile data from request
    const profileData = await request.json();

    // Connect to database
    const { db } = await connectToDatabase();

    // Update the admin in the database
    const result = await db.collection("users").updateOne(
      { email: session.user.email }, // Identifier
      {
        $set: {
          name: profileData.name,
          email: profileData.email,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui"
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui profil admin" },
      { status: 500 }
    );
  }
}
