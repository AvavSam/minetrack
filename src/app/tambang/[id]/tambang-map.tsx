"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface TambangMapProps {
  koordinat: {
    lat: number;
    lng: number;
  };
  namaTambang: string;
  tipeTambang: string;
  onLoad?: () => void;
}

export function TambangMap({ koordinat, namaTambang, tipeTambang, onLoad }: TambangMapProps) {
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

    // Notify parent component that map is loaded
    if (onLoad) {
      const timer = setTimeout(() => {
        onLoad();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [onLoad]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer center={[koordinat.lat, koordinat.lng]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[koordinat.lat, koordinat.lng]}>
        <Popup>
          <div className="text-sm">
            <h3 className="font-semibold">{namaTambang}</h3>
            <p>Tipe: {tipeTambang}</p>
            <p className="text-xs text-gray-500 mt-1">
              {koordinat.lat.toFixed(6)}, {koordinat.lng.toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
