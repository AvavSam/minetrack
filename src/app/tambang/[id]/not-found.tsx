import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TambangNotFound() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-red-100 p-3 rounded-full mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tambang Tidak Ditemukan</h1>
        <p className="text-gray-600 max-w-md mb-6">Data tambang yang Anda cari tidak ditemukan atau mungkin telah dihapus. Silakan kembali ke dashboard untuk melihat daftar tambang yang tersedia.</p>
        <Button asChild>
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
