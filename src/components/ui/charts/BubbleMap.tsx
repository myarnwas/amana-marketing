"use client";
import { useState } from "react";

interface BubbleData {
  id: string;
  name: string;
  country: string;
  value: number;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
}

interface BubbleMapProps {
  data: BubbleData[];
  height?: number;
}

export const BubbleMap = ({ data, height = 400 }: BubbleMapProps) => {
  const [selectedBubble, setSelectedBubble] = useState<BubbleData | null>(null);

  // 🌍 إحداثيات موسعة وموزعة بوضوح لخريطة الخليج
  const cityCoordinates: { [key: string]: { x: number; y: number } } = {
    "Riyadh": { x: 40, y: 45 },
    "Jeddah": { x: 25, y: 55 },
    "Mecca": { x: 30, y: 50 },
    "Medina": { x: 28, y: 40 },
    "Dammam": { x: 50, y: 40 },
    "Dubai": { x: 80, y: 50 },
    "Abu Dhabi": { x: 75, y: 58 },
    "Sharjah": { x: 83, y: 45 },
    "Doha": { x: 70, y: 47 },
    "Kuwait City": { x: 60, y: 35 },
    "Manama": { x: 65, y: 42 },
    "Muscat": { x: 90, y: 65 },
  };

  const maxRevenue = Math.max(...data.map((item) => item.value));
  const minRevenue = Math.min(...data.map((item) => item.value));

  const getBubbleSize = (value: number) => {
    const minSize = 30;
    const maxSize = 120;
    return (
      minSize +
      ((value - minRevenue) / (maxRevenue - minRevenue)) * (maxSize - minSize)
    );
  };

  const getBubbleColor = (roas: number) => {
    if (roas > 15) return "#10B981"; // أخضر
    if (roas > 8) return "#F59E0B";  // أصفر
    if (roas > 5) return "#EF4444";  // أحمر
    return "#6B7280"; // رمادي
  };

  const handleBubbleClick = (bubble: BubbleData) => {
    setSelectedBubble(selectedBubble?.id === bubble.id ? null : bubble);
  };

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      {/* الخريطة الخلفية (خليج مبسط) */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 to-gray-900/30 rounded-lg border border-gray-700">
        <div className="absolute inset-4 bg-amber-900/10 rounded-lg border border-amber-800/30">
          <div className="absolute right-10 top-1/2 w-20 h-32 bg-blue-500/10 border border-blue-500/20 rounded-lg"></div>
        </div>

        {/* الفقاعات */}
        {data.map((city) => {
          const coordinates = cityCoordinates[city.name];
          if (!coordinates) return null;

          const size = getBubbleSize(city.value);
          const color = getBubbleColor(city.roas);
          const isSelected = selectedBubble?.id === city.id;

          return (
            <div
              key={city.id}
              className="absolute cursor-pointer transition-all duration-300 ease-in-out"
              style={{
                left: `${coordinates.x}%`,
                top: `${coordinates.y}%`,
                transform: `translate(-50%, -50%) ${isSelected ? "scale(1.1)" : "scale(1)"}`,
                zIndex: isSelected ? 20 : 10,
              }}
              onClick={() => handleBubbleClick(city)}
            >
              <div
                className="rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center text-white font-bold transition-all duration-300"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  boxShadow: isSelected
                    ? `0 0 0 4px ${color}40, 0 8px 32px rgba(0,0,0,0.4)`
                    : "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                <span className="text-xs text-center px-1">
                  {city.name.split(" ")[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* معلومات المدينة عند الضغط */}
      {selectedBubble && (
        <div className="absolute top-4 right-4 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl z-30 min-w-64">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-white">{selectedBubble.name}</h3>
            <button
              onClick={() => setSelectedBubble(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Country:</span>
              <span className="text-white">{selectedBubble.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenue:</span>
              <span className="text-green-400 font-medium">
                {selectedBubble.revenue.toLocaleString()} SAR
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Spend:</span>
              <span className="text-red-400 font-medium">
                {selectedBubble.spend.toLocaleString()} SAR
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ROAS:</span>
              <span
                className={`font-bold ${
                  selectedBubble.roas > 15
                    ? "text-green-400"
                    : selectedBubble.roas > 8
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {selectedBubble.roas.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      )}

      {/* مفتاح الألوان */}
      <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 p-3 rounded-lg border border-gray-700">
        <h4 className="text-white text-sm font-bold mb-2">Map Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-300 text-xs">ROAS &gt; 15x</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-300 text-xs">ROAS 8–15x</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-300 text-xs">ROAS &lt; 8x</span>
          </div>
        </div>
      </div>
    </div>
  );
};
