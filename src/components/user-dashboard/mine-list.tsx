import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WeatherDisplay } from "./weather-display";
import { AirQualityDisplay } from "./air-quality-display";

import { Mine } from "@/types/mine";

interface MineListProps {
  tambangData: Mine[];
}

export function MineList({ tambangData }: MineListProps) {
  if (tambangData.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Tidak ada data tambang yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Nama Tambang</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Tipe</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Lisensi</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Koordinat</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Lingkungan</th>
            <th className="px-4 py-3 text-sm font-medium text-gray-500">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tambangData.map((tambang) => (
            <tr key={tambang._id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium text-gray-900">{tambang.namaTambang}</p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">{tambang.deskripsi}</p>
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{tambang.tipeTambang}</span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tambang.lisensi === "valid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {tambang.lisensi === "valid" ? "Valid" : "Pending"}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tambang.verifikasi ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {tambang.verifikasi ? "Verified" : "Unverified"}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500">
                {tambang.koordinat.lat.toFixed(6)}, {tambang.koordinat.lng.toFixed(6)}
              </td>
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <WeatherDisplay weatherData={tambang.dampakLingkungan?.cuaca} />
                  <AirQualityDisplay airQualityData={tambang.dampakLingkungan?.kualitasUdara} />
                </div>
              </td>
              <td className="px-4 py-4">
                <Button asChild size="sm">
                  <Link href={`/dashboard/tambang/${tambang._id}`}>Detail</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
