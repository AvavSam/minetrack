import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi data
    if (!body.namaTambang || !body.tipeTambang || !body.koordinat || !body.deskripsi) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Tambahkan timestamp, status verifikasi, dan lisensi
    const tambangData = {
      ...body,
      verifikasi: false, // Default false untuk pengajuan baru
      lisensi: "pending", // Default pending untuk pengajuan baru
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Koneksi ke database
    const { db } = await connectToDatabase();

    // Simpan data ke collection tambang
    const result = await db.collection("tambang").insertOne(tambangData);

    return NextResponse.json(
      {
        success: true,
        message: "Data tambang berhasil disimpan",
        id: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving mine data:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat menyimpan data" }, { status: 500 });
  }
}

import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { db } = await connectToDatabase();
    const tambangCollection = db.collection("tambang");

    // If ID is provided, return specific mine
    if (id) {
      try {
        const mine = await tambangCollection.findOne({ _id: new ObjectId(id) });
        if (!mine) {
          return NextResponse.json({ error: "Mine not found" }, { status: 404 });
        }
        return NextResponse.json(mine);
      } catch (error) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
    }

    // Otherwise return all mines
    const mines = await tambangCollection.find({}).toArray();
    return NextResponse.json(mines);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
