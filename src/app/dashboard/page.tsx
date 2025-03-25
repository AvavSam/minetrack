import type { Metadata } from "next";
import { DashboardMap } from "@/components/user-dashboard/map";
import { MineList } from "@/components/user-dashboard/mine-list";
import { SearchFilter } from "@/components/user-dashboard/search-filter";
import { getTambangTerverifikasi } from "@/lib/tambang";

export const metadata: Metadata = {
  title: "Dashboard | MineTrack",
  description: "Informasi detail mengenai tambang-tambang di sekitar pengguna",
};

export default async function DashboardPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Ambil parameter pencarian dan filter
  const params = await Promise.resolve(searchParams);
  const search = typeof params.search === "string" ? params.search : "";
  const tipeTambang = typeof params.tipeTambang === "string" ? params.tipeTambang : "";
  const izinTambang = typeof params.izinTambang === "string" ? params.izinTambang : "";

  // Ambil data tambang terverifikasi dari database
  const tambangData = await getTambangTerverifikasi({ search, tipeTambang, izinTambang });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Peta Lokasi Tambang</h2>
              <p className="text-sm text-gray-500">Visualisasi lokasi tambang terverifikasi</p>
            </div>
            <DashboardMap tambangData={tambangData} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Statistik Tambang</h2>
              <p className="text-sm text-gray-500">Ringkasan data tambang</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid gap-4">
                <StatCard title="Total Tambang" value={tambangData.length.toString()} icon="database" color="bg-blue-50 text-blue-600" />
                <StatCard title="Tambang Legal" value={tambangData.filter((t: { izinTambang: string }) => t.izinTambang === "legal").length.toString()} icon="check-circle" color="bg-green-50 text-green-600" />
                <StatCard title="Tambang Ilegal" value={tambangData.filter((t: { izinTambang: string }) => t.izinTambang === "ilegal").length.toString()} icon="alert-circle" color="bg-red-50 text-red-600" />
                <StatCard title="Tipe Tambang" value={Array.from(new Set(tambangData.map((t: { tipeTambang: string }) => t.tipeTambang))).length.toString()} icon="layers" color="bg-purple-50 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Daftar Tambang</h2>
              <p className="text-sm text-gray-500">Informasi detail tambang yang tersedia</p>
            </div>
            <SearchFilter />
          </div>
          <MineList tambangData={tambangData} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <span className="sr-only">{icon}</span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {icon === "database" && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          )}
          {icon === "check-circle" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
          {icon === "alert-circle" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          {icon === "layers" && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          )}
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
