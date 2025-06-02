"use client";

import { useEffect, useState } from "react";
import { Car, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Loader2, Sun, ThermometerSun } from "lucide-react";

import { useMine } from "@/context/MineContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type WeatherData = {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temperature: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    windSpeed: number;
    windDirection: string;
    precipitation: number;
    lastUpdated: string;
  };
};

export function WeatherWidget() {
  const { selectedMine } = useMine();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!selectedMine) {
        setWeatherData(null);
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
        setWeatherData(data);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedMine]);

  // Function to get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="h-8 w-8 text-amber-500" />;
      case "partly cloudy":
        return <Cloud className="h-8 w-8 text-blue-400" />;
      case "cloudy":
      case "overcast":
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case "rainy":
      case "patchy rain":
      case "moderate rain":
      case "heavy rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "drizzle":
      case "light rain":
      case "patchy light rain":
        return <CloudDrizzle className="h-8 w-8 text-blue-400" />;
      case "thunderstorm":
      case "thunder":
      case "patchy light rain with thunder":
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      case "snowy":
      case "snow":
      case "light snow":
      case "patchy snow":
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      case "foggy":
      case "mist":
      case "fog":
        return <CloudFog className="h-8 w-8 text-gray-300" />;
      default:
        return <ThermometerSun className="h-8 w-8 text-amber-500" />;
    }
  };

  if (!selectedMine) {
    return (
      <Card className="h-10/12">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
          <CardDescription>Select a mine to view weather data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-10/12">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <p>Loading weather data...</p>
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

  if (!weatherData) {
    return (
      <Card className="h-10/12">
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            <p>No weather data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-10/12">
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Current conditions at {weatherData.location.name || "Unknown Mine"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weatherData.current.condition.text)}
              <div>
                <p className="text-2xl font-bold">{weatherData.current.temperature}°C</p>
                <p className="text-sm text-muted-foreground">{weatherData.current.condition.text}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="text-sm">
              <p className="font-medium">Humidity</p>
              <p className="text-muted-foreground">{weatherData.current.humidity}%</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Wind</p>
              <p className="text-muted-foreground">
                {weatherData.current.windSpeed} km/h {weatherData.current.windDirection}
              </p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Precipitation</p>
              <p className="text-muted-foreground">{weatherData.current.precipitation} mm</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">{weatherData.location.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
