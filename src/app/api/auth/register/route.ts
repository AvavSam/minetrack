import { type NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validasi data
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Cek apakah email sudah digunakan
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
    }

    // Buat user baru
    const user = await createUser({ name, email, password });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: error.message || "Terjadi kesalahan saat mendaftar" }, { status: 500 });
  }
}
