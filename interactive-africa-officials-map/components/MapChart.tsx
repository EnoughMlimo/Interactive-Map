import React, { memo, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// A vibrant color palette for the countries
const COLORS = [
  "#38bdf8", // sky-400
  "#818cf8", // indigo-400
  "#f472b6", // pink-400
  "#fb923c", // orange-400
  "#a78bfa", // violet-400
  "#22d3ee", // cyan-400
  "#f87171", // red-400
  "#4ade80", // green-400,
  "#fbbf24", // amber-400
  "#60a5fa", // blue-400
];

interface MapChartProps {
  onCountryClick: (countryName: string) => void;
  availableCountries: string[];
  selectedCountryName: string;
}

const MapChart: React.FC<MapChartProps> = ({ onCountryClick, availableCountries, selectedCountryName }) => {
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Memoize the color mapping to avoid recalculation on every render
  const countryColorMap = useMemo(() => {
    const map = new Map<string, string>();
    availableCountries.forEach((country, index) => {
      map.set(country, COLORS[index % COLORS.length]);
    });
    return map;
  }, [availableCountries]);

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPos({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };
  
  return (
    <div 
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltipContent('')} // Hide tooltip if mouse leaves the whole map area
    >
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-20.0, -10.0, 0], // Move map up
          scale: 400
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const countryName = geo.properties.name;
                const isAvailable = availableCountries.includes(countryName);
                const isSelected = selectedCountryName === countryName;
                
                // Get the unique color for the country, or default to gray for unavailable ones
                const countryColor = countryColorMap.get(countryName) || "#374151";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => isAvailable && onCountryClick(countryName)}
                    onMouseEnter={() => setTooltipContent(countryName)}
                    onMouseLeave={() => setTooltipContent('')}
                    style={{
                      default: {
                        fill: isSelected ? "#A3E635" : countryColor, // lime-400 (selected), unique color, or gray-700
                        stroke: "#111827", // gray-900
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isSelected ? "#A3E635" : isAvailable ? "#14B8A6" : "#4B5563", // lime-400 (selected), teal-500, gray-600
                        stroke: "#111827",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: isAvailable ? "pointer" : "default",
                      },
                      pressed: {
                        fill: isSelected ? "#A3E635" : isAvailable ? "#0D9488" : "#4B5563", // lime-400 (selected), teal-600, gray-600
                        stroke: "#111827",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                    className={`transition-colors duration-200 ${isAvailable ? 'cursor-pointer' : ''}`}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <div
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(15px, -25px)',
          }}
          className="absolute z-10 pointer-events-none bg-gray-800 border border-cyan-500/30 text-white text-sm rounded-lg px-3 py-1.5 shadow-xl"
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default memo(MapChart);