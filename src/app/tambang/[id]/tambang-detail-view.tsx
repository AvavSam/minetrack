"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Tag, FileText, CheckCircle, XCircle, AlertTriangle, BarChart3, Layers, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  // Helper function for license status color
  const getLicenseColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "expiring":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      case "expired":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-slate-500 hover:bg-slate-600 text-white";
    }
  };

  // Helper function for mine type
  const getMineTypeLabel = (type: string) => {
    switch (type) {
      case "emas":
        return "Tambang Emas";
      case "batu_bara":
        return "Tambang Batu Bara";
      case "timah":
        return "Tambang Timah";
      case "bijih_besi":
        return "Tambang Bijih Besi";
      case "nikel":
        return "Tambang Nikel";
      case "tembaga":
        return "Tambang Tembaga";
      default:
        return `Tambang ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('/mining-pattern.png')] bg-repeat"></div>
        </div>
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="outline" size="sm" asChild className="bg-white/20 hover:bg-white/30 border-white/40 text-white">
              <Link href="/dashboard" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Kembali ke Dashboard</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{tambang.namaTambang}</h1>
              <div className="flex items-center gap-1 mt-2 text-emerald-100">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {tambang.koordinat?.lat.toFixed(6)}, {tambang.koordinat?.lng.toFixed(6)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3 md:mt-0">
              <Badge className="py-1.5 px-3 bg-white/20 hover:bg-white/30 text-white border-white/10">{getMineTypeLabel(tambang.tipeTambang)}</Badge>
              <Badge className={`py-1.5 px-3 ${getLicenseColor(tambang.lisensi)}`}>{tambang.lisensi === "valid" ? "Lisensi Valid" : "Lisensi Pending"}</Badge>
              <Badge className={`py-1.5 px-3 ${tambang.verifikasi ? "bg-emerald-500 hover:bg-emerald-600" : "bg-red-500 hover:bg-red-600"} text-white`}>
                {tambang.verifikasi ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Terverifikasi
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Belum Terverifikasi
                  </div>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Informasi Dasar Card */}
          <Card className="border border-slate-200 shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader className="pb-3 border-b bg-slate-50">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-emerald-600" />
                <CardTitle className="text-xl">Informasi Dasar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Tag className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Nama Tambang</span>
                  </div>
                  <p className="font-semibold text-lg pl-6">{tambang.namaTambang}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Koordinat</span>
                  </div>
                  <p className="font-mono bg-slate-50 p-2 rounded text-sm pl-6">
                    {tambang.koordinat.lat.toFixed(6)}, {tambang.koordinat.lng.toFixed(6)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Layers className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Tipe Tambang</span>
                  </div>
                  <p className="pl-6">{getMineTypeLabel(tambang.tipeTambang)}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Deskripsi</span>
                  </div>
                  <p className="text-sm bg-slate-50 p-3 rounded border border-slate-100">{tambang.deskripsi}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Dibuat</span>
                  </div>
                  <p className="text-sm">{formatDate(tambang.createdAt)}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                    <span className="font-medium">Diperbarui</span>
                  </div>
                  <p className="text-sm">{formatDate(tambang.updatedAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                <div className="flex items-center">
                  <span className="font-medium text-slate-700">Status Lisensi</span>
                </div>
                <div>
                  {tambang.lisensi === "valid" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Valid</span>
                      </div>
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Pending</span>
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                <div className="flex items-center">
                  <span className="font-medium text-slate-700">Status Verifikasi</span>
                </div>
                <div>
                  {tambang.verifikasi ? (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Terverifikasi</span>
                      </div>
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300">
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Belum Terverifikasi</span>
                      </div>
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-700">Cuaca</h3>
                <div className="rounded-md">
                  <WeatherDisplay weatherData={tambang.dampakLingkungan?.cuaca} />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-slate-700">Kualitas Udara</h3>
                <div className="rounded-md">
                  <AirQualityDisplay airQualityData={tambang.dampakLingkungan?.kualitasUdara} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="border border-slate-200 shadow-md h-fit pb-0 overflow-hidden">
            <CardHeader className="pb-3 border-b bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  <CardTitle className="text-xl">Lokasi Tambang</CardTitle>
                </div>
                <Badge variant="outline" className="bg-white">
                  {tambang.koordinat?.lat.toFixed(4)}, {tambang.koordinat?.lng.toFixed(4)}
                </Badge>
              </div>
              <CardDescription>Peta interaktif lokasi tambang</CardDescription>
            </CardHeader>

            <CardContent className="p-0 h-[700px] relative">
              <TambangMap koordinat={tambang.koordinat} namaTambang={tambang.namaTambang} tipeTambang={tambang.tipeTambang} onLoad={() => setIsMapLoaded(true)} />

              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-3 text-emerald-800 font-medium">Memuat peta lokasi tambang...</p>
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
