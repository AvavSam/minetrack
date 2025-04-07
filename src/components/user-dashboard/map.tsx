"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, X } from "lucide-react";
import { WeatherDisplay } from "./weather-display";
import { AirQualityDisplay } from "./air-quality-display";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

import { Mine } from "@/types/mine";
import { Badge } from "@/components/ui/badge";

interface DashboardMapProps {
  tambangData: Mine[];
}

export function DashboardMap({ tambangData }: DashboardMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [markerIcons, setMarkerIcons] = useState<{
    defaultIcon: any;
    legalIcon: any;
    illegalIcon: any;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);

    // Fix untuk icon Leaflet di Next.js
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });

        // Create custom icons
        const defaultIcon = new L.Icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const legalIcon = new L.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const illegalIcon = new L.Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        setMarkerIcons({ defaultIcon, legalIcon, illegalIcon });
        setLeafletLoaded(true);
      });
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[500px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Hitung center peta berdasarkan rata-rata koordinat tambang
  const center =
    tambangData.length > 0
      ? {
          lat: tambangData.reduce((sum, mine) => sum + mine.koordinat.lat, 0) / tambangData.length,
          lng: tambangData.reduce((sum, mine) => sum + mine.koordinat.lng, 0) / tambangData.length,
        }
      : { lat: -2.5489, lng: 118.0149 }; // Default ke tengah Indonesia

  return (
    <div className="relative">
      <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 relative">
        {isMounted && (
          <MapContainer center={[center.lat, center.lng]} zoom={5} style={{ height: "100%", width: "100%" }} className="z-[1]" attributionControl={true} zoomControl={true} doubleClickZoom={true} scrollWheelZoom={true} dragging={true} easeLinearity={0.35}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {leafletLoaded &&
              markerIcons &&
              tambangData.map((mine) => (
                <Marker
                  key={mine._id}
                  position={[mine.koordinat.lat, mine.koordinat.lng]}
                  icon={mine.lisensi === "valid" ? markerIcons.legalIcon : markerIcons.illegalIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedMine(mine);
                    },
                  }}
                >
                  <Popup>
                    <div className="space-y-2 p-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{mine.namaTambang}</h3>
                        <Badge variant={mine.verifikasi ? "default" : "outline"} className="ml-2">
                          {mine.verifikasi ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                          {mine.verifikasi ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          <strong>Type:</strong> {mine.tipeTambang}
                        </p>
                        <p>
                          <strong>Lisensi Tambang:</strong> {mine.lisensi === "valid" ? "Valid" : "Pending"}
                        </p>
                        {mine.deskripsi && <p className="mt-1">{mine.deskripsi}</p>}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        )}
      </div>

      {/* {selectedMine && (
        <div className="absolute bottom-4 right-4 w-80" style={{ zIndex: 1000 }}>
          <Card className="shadow-lg border-gray-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold">{selectedMine.namaTambang}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedMine(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tipe Tambang</p>
                  <p className="font-medium">{selectedMine.tipeTambang}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status Izin</p>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedMine.izinTambang === "legal" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {selectedMine.izinTambang === "legal" ? "Legal" : "Ilegal"}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Koordinat</p>
                  <p className="font-medium">
                    {selectedMine.koordinat.lat.toFixed(6)}, {selectedMine.koordinat.lng.toFixed(6)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Deskripsi</p>
                  <p className="text-sm">{selectedMine.deskripsi}</p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-medium mb-2">Data Lingkungan</p>
                  <div className="grid grid-cols-2 gap-2">
                    <WeatherDisplay weatherData={selectedMine.dampakLingkungan?.cuaca} />
                    <AirQualityDisplay airQualityData={selectedMine.dampakLingkungan?.kualitasUdara} />
                  </div>
                </div>

                <Button className="w-full">Lihat Detail Lengkap</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )} */}
    </div>
  );
}
