import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";
    const typeFilter = searchParams.get("type") || "all";
    const statusFilter = searchParams.get("status") || "all";
    const verificationFilter = searchParams.get("verification") || "all";

    const { db } = await connectToDatabase();
    const tambangCollection = db.collection("tambang");

    // Build the query based on filters
    const query: any = {};

    // Search filter (name or location)
    if (searchTerm) {
      query.$or = [
        { namaTambang: { $regex: searchTerm, $options: "i" } },
        { deskripsi: { $regex: searchTerm, $options: "i" } }
      ];
    }

    // Type filter
    if (typeFilter !== "all") {
      query.tipeTambang = typeFilter;
    }

    // License status filter
    if (statusFilter !== "all") {
      query.lisensi = statusFilter.toLowerCase();
    }

    // Verification filter
    if (verificationFilter !== "all") {
      query.verifikasi = verificationFilter === "verified";
    }

    // Fetch mines from database
    const mines = await tambangCollection.find(query).toArray();

    // Transform the data to match the expected format in the mine-table component
    const formattedMines = mines.map((mine: { _id: ObjectId; namaTambang: string; tipeTambang: string; deskripsi: string; verifikasi: boolean; lisensi: string; updatedAt: Date }) => ({
      id: mine._id.toString(),
      name: mine.namaTambang,
      type: mine.tipeTambang,
      location: mine.deskripsi.split(".")[0] || "Unknown", // Using first sentence of description as location
      status: mine.verifikasi ? "Active" : "Pending",
      licenseStatus: mine.lisensi === "valid" ? "Valid" : "Pending",
      verified: mine.verifikasi,
      lastUpdated: new Date(mine.updatedAt).toISOString().split("T")[0],
    }));

    return NextResponse.json(formattedMines);
  } catch (error) {
    console.error("Error fetching mines:", error);
    return NextResponse.json({ error: "Failed to fetch mines data" }, { status: 500 });
  }
}
