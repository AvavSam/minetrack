"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Tag, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WeatherDisplay } from "@/components/user-dashboard/weather-display";
import { AirQualityDisplay } from "@/components/user-dashboard/air-quality-display";
import { TambangMap } from "./tambang-map";
import type { Mine } from "@/types/mine";

interface TambangDetailViewProps {
  tambang: Mine;
}

export function TambangDetailView({ tambang }: TambangDetailViewProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
              <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Kembali</span>
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{tambang.namaTambang}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={tambang.tipeTambang === "emas" ? "default" : "outline"} className="bg-blue-500">
              {tambang.tipeTambang}
            </Badge>
            <Badge variant={tambang.lisensi === "valid" ? "default" : "outline"} className={tambang.lisensi === "valid" ? "bg-green-500" : "bg-yellow-500"}>
              {tambang.lisensi === "valid" ? "Lisensi Valid" : "Lisensi Pending"}
            </Badge>
            <Badge variant={tambang.verifikasi ? "default" : "outline"} className={tambang.verifikasi ? "bg-emerald-500" : "bg-red-500"}>
              {tambang.verifikasi ? "Terverifikasi" : "Belum Terverifikasi"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informasi Dasar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>Nama Tambang</span>
                </div>
                <p className="font-medium">{tambang.namaTambang}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Koordinat</span>
                </div>
                <p className="font-medium">
                  {tambang.koordinat.lat.toFixed(6)}, {tambang.koordinat.lng.toFixed(6)}
                </p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Deskripsi</span>
                </div>
                <p className="text-sm">{tambang.deskripsi}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Tanggal Dibuat</span>
                </div>
                <p className="font-medium">{formatDate(tambang.createdAt)}</p>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Terakhir Diperbarui</span>
                </div>
                <p className="font-medium">{formatDate(tambang.updatedAt)}</p>
              </div>
              <Separator />
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Status Lisensi</span>
                </div>
                <div className="flex items-center">
                  {tambang.lisensi === "valid" ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-700">Lisensi Valid</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="font-medium text-yellow-700">Lisensi Pending</span>
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Status Verifikasi</span>
                </div>
                <div className="flex items-center">
                  {tambang.verifikasi ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-2" />
                      <span className="font-medium text-emerald-700">Terverifikasi</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium text-red-700">Belum Terverifikasi</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Lingkungan */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Data Lingkungan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Cuaca</h3>
                  <WeatherDisplay weatherData={tambang.dampakLingkungan?.cuaca} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Kualitas Udara</h3>
                  <AirQualityDisplay airQualityData={tambang.dampakLingkungan?.kualitasUdara} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peta */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Lokasi Tambang</CardTitle>
            </CardHeader>
            <CardContent className="h-[500px] p-0 relative">
              <TambangMap koordinat={tambang.koordinat} namaTambang={tambang.namaTambang} tipeTambang={tambang.tipeTambang} onLoad={() => setIsMapLoaded(true)} />
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Memuat peta...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
