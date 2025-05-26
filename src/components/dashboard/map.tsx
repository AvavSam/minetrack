"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle, Clock, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMine } from "@/context/MineContext";

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Custom marker icons for license status
const validIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const pendingIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const expiringIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const expiredIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Function to get marker icon based on license status
const getMarkerIcon = (lisensi: "valid" | "pending" | "expiring" | "expired" | undefined) => {
  if (!lisensi) return pendingIcon;

  switch (lisensi) {
    case "valid":
      return validIcon;
    case "pending":
      return pendingIcon;
    case "expiring":
      return expiringIcon;
    case "expired":
      return expiredIcon;
    default:
      return pendingIcon;
  }
};

// Map center adjustment component
function MapCenterAdjust({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

import { Mine } from "@/types/mine";

export default function DashboardMap() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedMine, setSelectedMine } = useMine<Mine>();

  useEffect(() => {
    fixLeafletIcon();

    const fetchMines = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tambang");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setMines(data);
      } catch (err) {
        console.error("Failed to fetch mines:", err);
        setError("Failed to load mine data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMines();
  }, []);

  // Default center
  const center: [number, number] = [-2.169, 120.655];

  // If a mine is selected and has valid coordinates, use them as the center
  const mapCenter = selectedMine?.koordinat ? ([selectedMine.koordinat.lat, selectedMine.koordinat.lng] as [number, number]) : center;

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading mine data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <MapContainer center={center} zoom={6} style={{ height: "100%", width: "100%" }} className="z-0">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {mapCenter && <MapCenterAdjust center={mapCenter} />}

      {mines.map(
        (mine) =>
          mine.koordinat && (
            <Marker
              key={mine._id}
              position={[mine.koordinat.lat, mine.koordinat.lng]}
              icon={getMarkerIcon(mine.lisensi)}
              eventHandlers={{
                click: () => {
                  setSelectedMine(mine);
                },
              }}
            >
              <Popup className="mine-popup">
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
                      <strong>Lisensi Tambang:</strong> {mine.lisensi ? mine.lisensi.charAt(0).toUpperCase() + mine.lisensi.slice(1) : 'Unknown'}
                    </p>
                    {mine.deskripsi && <p className="mt-1">{mine.deskripsi}</p>}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                    {!mine.verifikasi && <Button size="sm">Verify</Button>}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}
