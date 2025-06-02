"use client";

import { useEffect, useState } from "react";
import { Loader2, Wind } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useMine } from "@/context/MineContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type AirQualityData = {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  usEpaIndex: number;
};

export function AirQualityWidget() {
  const { selectedMine } = useMine();
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAirQualityData = async () => {
      if (!selectedMine) {
        setAirQualityData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { lat, lng } = selectedMine.koordinat;
        const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.airQuality) {
          throw new Error("Air quality data not available for this location");
        }

        setAirQualityData(data.airQuality);
      } catch (err) {
        console.error("Failed to fetch air quality data:", err);
        setError("Failed to load air quality data");
      } finally {
        setLoading(false);
      }
    };

    fetchAirQualityData();
  }, [selectedMine]);

  // Function to get AQI category based on US EPA Index
  const getAqiCategory = (index: number) => {
    switch (index) {
      case 1:
        return "Good";
      case 2:
        return "Moderate";
      case 3:
        return "Unhealthy for Sensitive Groups";
      case 4:
        return "Unhealthy";
      case 5:
        return "Very Unhealthy";
      case 6:
        return "Hazardous";
      default:
        return "Unknown";
    }
  };

  // Function to get color based on AQI value
  const getAqiColor = (index: number) => {
    switch (index) {
      case 1:
        return "bg-green-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-orange-500";
      case 4:
        return "bg-red-500";
      case 5:
        return "bg-purple-500";
      case 6:
        return "bg-rose-900";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get text color based on AQI value
  const getAqiTextColor = (index: number) => {
    switch (index) {
      case 1:
        return "text-green-500";
      case 2:
        return "text-yellow-500";
      case 3:
        return "text-orange-500";
      case 4:
        return "text-red-500";
      case 5:
        return "text-purple-500";
      case 6:
        return "text-rose-900";
      default:
        return "text-gray-500";
    }
  };

  if (!selectedMine) {
    return (
      <Card className="h-10/12">
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Select a mine to view air quality data</CardDescription>
      </CardHeader>
    </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-10/12">
        <CardHeader>
          <CardTitle>Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <p>Loading air quality data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-32">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!airQualityData) {
    return (
      <Card className="h-10/12">
        <CardHeader>
          <CardTitle>Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <p>No air quality data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-10/12">
      <CardHeader>
        <CardTitle>Air Quality</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  AQI: <span className={getAqiTextColor(airQualityData.usEpaIndex)}>{airQualityData.usEpaIndex}</span>
                </p>
                <p className="text-sm text-muted-foreground">{getAqiCategory(airQualityData.usEpaIndex)}</p>
              </div>
            </div>
          </div>

          <Progress value={airQualityData.usEpaIndex} max={6} className={`h-2 ${getAqiColor(airQualityData.usEpaIndex)}`} />

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-sm">
              <p className="font-medium">PM2.5</p>
              <p className="text-muted-foreground">{airQualityData.pm2_5.toFixed(1)} µg/m³</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">PM10</p>
              <p className="text-muted-foreground">{airQualityData.pm10.toFixed(1)} µg/m³</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">CO</p>
              <p className="text-muted-foreground">{airQualityData.co.toFixed(1)} ppm</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">NO₂</p>
              <p className="text-muted-foreground">{airQualityData.no2.toFixed(1)} ppb</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
