import { NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
    }

    // Fetch weather data from WeatherAPI with coordinates in the correct format
    const coordinates = `${lat},${lng}`;
    const response = await fetch(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${coordinates}&aqi=yes`);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Format the response to include only what we need
    const weatherData = {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
      },
      current: {
        temperature: data.current.temp_c,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon,
        },
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        windDirection: data.current.wind_dir,
        precipitation: data.current.precip_mm,
        lastUpdated: data.current.last_updated,
      },
      airQuality: data.current.air_quality
        ? {
            co: data.current.air_quality.co,
            no2: data.current.air_quality.no2,
            o3: data.current.air_quality.o3,
            so2: data.current.air_quality.so2,
            pm2_5: data.current.air_quality.pm2_5,
            pm10: data.current.air_quality.pm10,
            usEpaIndex: data.current.air_quality["us-epa-index"],
          }
        : null,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
