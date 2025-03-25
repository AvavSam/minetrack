import { Cloud, CloudRain, Sun, Thermometer } from "lucide-react";

interface WeatherData {
  temp_c?: number;
  condition?: {
    text?: string;
    icon?: string;
  };
}

interface WeatherDisplayProps {
  weatherData?: WeatherData;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  if (!weatherData || !weatherData.temp_c) {
    return (
      <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center justify-center">
        <Cloud className="h-6 w-6 text-gray-400 mb-1" />
        <p className="text-xs text-gray-500">Data cuaca tidak tersedia</p>
      </div>
    );
  }

  // Tentukan ikon berdasarkan kondisi cuaca
  let WeatherIcon = Cloud;
  if (weatherData.condition?.text) {
    const condition = weatherData.condition.text.toLowerCase();
    if (condition.includes("rain") || condition.includes("hujan")) {
      WeatherIcon = CloudRain;
    } else if (condition.includes("sun") || condition.includes("clear") || condition.includes("cerah")) {
      WeatherIcon = Sun;
    }
  }

  return (
    <div className="bg-blue-50 rounded-md p-3 flex flex-col items-center justify-center">
      <div className="flex items-center mb-1">
        <WeatherIcon className="h-5 w-5 text-blue-500 mr-1" />
        <span className="text-sm font-medium text-blue-700">{weatherData.condition?.text || "Cuaca"}</span>
      </div>
      <div className="flex items-center">
        <Thermometer className="h-4 w-4 text-blue-500 mr-1" />
        <span className="text-lg font-bold text-blue-700">{weatherData.temp_c}°C</span>
      </div>
    </div>
  );
}
