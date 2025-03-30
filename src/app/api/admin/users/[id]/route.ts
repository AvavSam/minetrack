import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the user is authenticated and is an admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { role } = body;

    // Validate the role
    if (!role || !["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Peran tidak valid" }, { status: 400 });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Update the user's role
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          role,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Peran pengguna berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui peran pengguna" }, { status: 500 });
  }
}
