import { Mine } from '@/types/mine';

// Define the weather data structure to match API response
export type WeatherData = {
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
  airQuality?: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    usEpaIndex: number;
  } | null;
};

// Mock weather data for development
const mockWeatherData = {
  location: {
    name: "Sample Location",
    region: "Sample Region",
    country: "Indonesia"
  },
  current: {
    temperature: 28,
    condition: {
      text: "Sunny",
      icon: "sun"
    },
    humidity: 65,
    windSpeed: 10,
    windDirection: "N",
    precipitation: 0,
    lastUpdated: new Date().toISOString()
  },
  airQuality: {
    co: 0.8,
    no2: 12,
    o3: 25,
    so2: 8,
    pm2_5: 10,
    pm10: 20,
    usEpaIndex: 1
  }
};

// Function to fetch weather data for a specific mine location
export async function getWeatherData(mine: Mine) {
  try {
    const { lat, lng } = mine.koordinat;

    // Construct absolute URL to handle both client and server environments
    let apiUrl;
    if (typeof window !== 'undefined') {
      // Browser environment - use window.location.origin
      apiUrl = `${window.location.origin}/api/weather?lat=${lat}&lng=${lng}`;
    } else {
      // Server environment - use process.env.NEXT_PUBLIC_BASE_URL or a default
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      apiUrl = `${baseUrl}/api/weather?lat=${lat}&lng=${lng}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match the expected format for the components
    const transformedData = {
      cuaca: {
        temp_c: data.current.temperature,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon
        }
      },
      kualitasUdara: data.airQuality ? {
        pm2_5: data.airQuality.pm2_5,
        co: data.airQuality.co,
        no2: data.airQuality.no2,
        o3: data.airQuality.o3,
        so2: data.airQuality.so2
      } : undefined
    };

    return transformedData;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    // Return mock data as fallback but in the transformed format
    return {
      cuaca: {
        temp_c: mockWeatherData.current.temperature,
        condition: {
          text: mockWeatherData.current.condition.text,
          icon: mockWeatherData.current.condition.icon
        }
      },
      kualitasUdara: mockWeatherData.airQuality ? {
        pm2_5: mockWeatherData.airQuality.pm2_5,
        co: mockWeatherData.airQuality.co,
        no2: mockWeatherData.airQuality.no2,
        o3: mockWeatherData.airQuality.o3,
        so2: mockWeatherData.airQuality.so2
      } : undefined
    };
  }
}

// Function to attach weather data to a mine
export async function attachWeatherData(mine: Mine): Promise<Mine> {
  const weatherData = await getWeatherData(mine);
  return {
    ...mine,
    dampakLingkungan: weatherData
  };
}

// Function to attach weather data to multiple mines
export async function attachWeatherDataToMines(mines: Mine[]): Promise<Mine[]> {
  return Promise.all(mines.map(mine => attachWeatherData(mine)));
}
