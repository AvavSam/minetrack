import type { Metadata } from "next";
import PengajuanTambangForm from "./form";

export const metadata: Metadata = {
  title: "Pengajuan Tambang Baru | MineTrack",
  description: "Ajukan tambang baru untuk diverifikasi oleh admin",
};

export default function PengajuanTambangPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengajuan Tambang Baru</h1>
          <p className="text-gray-600">Silakan isi formulir di bawah ini untuk mengusulkan tambang baru. Data yang Anda ajukan akan diverifikasi oleh admin sebelum ditampilkan di peta utama.</p>
        </div>
        <PengajuanTambangForm />
      </div>
    </div>
  );
}
