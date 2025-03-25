"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

// import { Mine } from "@/types/mine";

interface MapSelectorProps {
  initialPosition: { lat: number; lng: number };
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapSelector({ initialPosition, onLocationSelect }: MapSelectorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Fix untuk icon Leaflet di Next.js
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Komponen untuk menangkap event klik pada peta
  function LocationMarker() {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    const map = useMapEvents({
      click(e) {
        const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
        setPosition(newPos);
        onLocationSelect(newPos.lat, newPos.lng);
      },
    });

    return position === null ? null : <Marker position={[position.lat, position.lng]} />;
  }

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border border-gray-200">
      <MapContainer center={[initialPosition.lat, initialPosition.lng]} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        {initialPosition && <Marker position={[initialPosition.lat, initialPosition.lng]} />}
      </MapContainer>
    </div>
  );
}
