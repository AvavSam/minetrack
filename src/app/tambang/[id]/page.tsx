import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTambangById } from "@/lib/tambang";
import { TambangDetailView } from "./tambang-detail-view";
import { TambangDetailSkeleton } from "./tambang-detail-skeleton";
import { Suspense } from "react";

interface TambangDetailPageProps {
  params: {
    id: string;
  };
}

// Metadata dinamis berdasarkan data tambang
export async function generateMetadata(
  { params }: TambangDetailPageProps
): Promise<Metadata> {
  const id = params.id;

  try {
    const tambang = await getTambangById(id);

    if (!tambang) {
      return {
        title: "Tambang Tidak Ditemukan | MineTrack",
        description: "Data tambang yang Anda cari tidak ditemukan",
      };
    }

    return {
      title: `${tambang.namaTambang} | MineTrack`,
      description: `Detail informasi tambang ${tambang.namaTambang} - ${tambang.tipeTambang}`,
    };
  } catch (error) {
    return {
      title: "Error | MineTrack",
      description: "Terjadi kesalahan saat memuat data tambang",
    };
  }
}

export default async function TambangDetailPage({ params }: TambangDetailPageProps) {
  const id = params.id;

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <Suspense fallback={<TambangDetailSkeleton />}>
        <TambangDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function TambangDetailContent({ id }: { id: string }) {
  try {
    const tambang = await getTambangById(id);

    if (!tambang) {
      notFound();
    }

    return <TambangDetailView tambang={tambang} />;
  } catch (error) {
    throw new Error("Gagal memuat data tambang");
  }
}
