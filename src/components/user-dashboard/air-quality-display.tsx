import { Wind } from "lucide-react";

interface AirQualityData {
  pm2_5?: number;
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
}

interface AirQualityDisplayProps {
  airQualityData?: AirQualityData;
}

export function AirQualityDisplay({ airQualityData }: AirQualityDisplayProps) {
  if (!airQualityData || (!airQualityData.pm2_5 && !airQualityData.co)) {
    return (
      <div className="bg-gray-50 rounded-md p-3 flex flex-col items-center justify-center">
        <Wind className="h-6 w-6 text-gray-400 mb-1" />
        <p className="text-xs text-gray-500">Data kualitas udara tidak tersedia</p>
      </div>
    );
  }

  // Hitung kualitas udara berdasarkan PM2.5
  let airQualityLevel = "Baik";
  let airQualityColor = "text-green-700";
  let airQualityBg = "bg-green-50";

  if (airQualityData.pm2_5) {
    if (airQualityData.pm2_5 > 55.4) {
      airQualityLevel = "Berbahaya";
      airQualityColor = "text-red-700";
      airQualityBg = "bg-red-50";
    } else if (airQualityData.pm2_5 > 35.4) {
      airQualityLevel = "Tidak Sehat";
      airQualityColor = "text-orange-700";
      airQualityBg = "bg-orange-50";
    } else if (airQualityData.pm2_5 > 12) {
      airQualityLevel = "Sedang";
      airQualityColor = "text-yellow-700";
      airQualityBg = "bg-yellow-50";
    }
  }

  return (
    <div className={`${airQualityBg} rounded-md p-3 flex flex-col items-center justify-center`}>
      <div className="flex items-center mb-1">
        <Wind className={`h-5 w-5 ${airQualityColor} mr-1`} />
        <span className={`text-sm font-medium ${airQualityColor}`}>{airQualityLevel}</span>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {airQualityData.pm2_5 && (
          <div className={`text-center ${airQualityColor}`}>
            <p className="font-semibold">PM2.5</p>
            <p>{airQualityData.pm2_5}</p>
          </div>
        )}
        {airQualityData.co && (
          <div className={`text-center ${airQualityColor}`}>
            <p className="font-semibold">CO</p>
            <p>{airQualityData.co}</p>
          </div>
        )}
      </div>
    </div>
  );
}
