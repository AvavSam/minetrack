import { connectToDatabase } from "./mongodb";
import { ObjectId } from "mongodb";
import { Mine } from "@/types/mine";

interface FilterOptions {
  search?: string;
  tipeTambang?: string;
  lisensi?: "valid" | "pending";
}

export async function getTambangTerverifikasi(filter: FilterOptions = {}): Promise<Mine[]> {
  const { db } = await connectToDatabase();

  // Buat query filter
  const query: Partial<Mine> = { verifikasi: true };

  if (filter.search) {
    query.namaTambang = { $regex: filter.search, $options: "i" } as any;
  }

  if (filter.tipeTambang) {
    query.tipeTambang = filter.tipeTambang;
  }

  if (filter.lisensi) {
    query.lisensi = filter.lisensi;
  }

  // Ambil data tambang dari database
  const tambangData = await db.collection("tambang").find(query).toArray();

  // Konversi _id dari ObjectId ke string
  return tambangData.map((tambang: any) => ({
    ...tambang,
    _id: tambang._id.toString(),
  }));
}

export async function getTambangById(id: string): Promise<Mine | null> {
  const { db } = await connectToDatabase();

  // Ambil data tambang berdasarkan ID
  const tambang = await db.collection("tambang").findOne({ _id: new ObjectId(id) });

  if (!tambang) {
    return null;
  }

  // Konversi _id dari ObjectId ke string
  return {
    ...tambang,
    _id: tambang._id.toString(),
  } as Mine;
}
