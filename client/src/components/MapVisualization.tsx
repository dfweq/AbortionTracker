import { Card, CardContent } from "@/components/ui/card";
import { useRef, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AbortionStat, DataView } from "@shared/schema";
import { Search, ZoomIn, ZoomOut, Minimize } from "lucide-react";

// Import necessary libraries for map visualization
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { geoCentroid } from "d3-geo";

// US map GeoJSON data URL
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface MapVisualizationProps {
  abortionStats: AbortionStat[];
  isLoading: boolean;
  dataView: DataView;
}

export default function MapVisualization({ abortionStats, isLoading, dataView }: MapVisualizationProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [tooltipContent, setTooltipContent] = useState<JSX.Element | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  // Get min and max values based on data view
  const getMinMax = () => {
    if (abortionStats.length === 0) return { min: 0, max: 100000 };
    
    if (dataView === DataView.RATE) {
      const rates = abortionStats.map(stat => parseFloat(stat.rate.toString()));
      return { min: Math.min(...rates), max: Math.max(...rates) };
    } else if (dataView === DataView.PERCENTAGE) {
      const changes = abortionStats.map(stat => parseFloat(stat.change.toString()));
      return { min: Math.min(...changes), max: Math.max(...changes) };
    } else {
      // Default: TOTAL
      const counts = abortionStats.map(stat => stat.count);
      return { min: Math.min(...counts), max: Math.max(...counts) };
    }
  };
  
  // Define color scale based on data view
  const getColorScale = () => {
    const { min, max } = getMinMax();
    
    if (dataView === DataView.PERCENTAGE) {
      // Special scale for percentage change (red for negative, green for positive)
      return scaleQuantize<string>()
        .domain([min, max])
        .range([
          "#EF4444", // red-500
          "#F87171", // red-400
          "#FECACA", // red-200
          "#D1FAE5", // green-100
          "#6EE7B7", // green-300
          "#10B981", // green-500
          "#059669"  // green-600
        ]);
    } else {
      // Default green scale for count and rate
      return scaleQuantize<string>()
        .domain([min, max])
        .range([
          "#EDF8E9",
          "#BAE4B3",
          "#74C476",
          "#31A354",
          "#006D2C"
        ]);
    }
  };
  
  const colorScale = getColorScale();
  
  // Get state data by ID
  const getStateData = (stateId: string) => {
    return abortionStats.find(stat => stat.stateId === stateId);
  };
  
  // Format value based on data view
  const formatValue = (value: number | string, view: DataView) => {
    if (view === DataView.RATE) {
      return `${value} per 1,000 women`;
    } else if (view === DataView.PERCENTAGE) {
      const numVal = typeof value === 'string' ? parseFloat(value) : value;
      const sign = numVal >= 0 ? '+' : '';
      return `${sign}${numVal}%`;
    } else {
      return value.toLocaleString();
    }
  };
  
  // Handle geography hover
  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const { properties } = geo;
    const stateId = properties.postal;
    const stateData = getStateData(stateId);
    
    if (stateData) {
      // Create tooltip content
      setTooltipContent(
        <div className="font-sans">
          <div className="font-bold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            {stateData.stateName}
          </div>
          <div className="text-sm mt-1">
            Total Count: <span className="font-semibold">{stateData.count.toLocaleString()}</span>
          </div>
          <div className="text-sm">
            Rate: <span className="font-semibold">{stateData.rate} per 1,000 women</span>
          </div>
          <div className="text-sm">
            YoY Change: <span className={`font-semibold ${stateData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stateData.change >= 0 ? '+' : ''}{stateData.change}%
            </span>
          </div>
          <div className="text-sm mt-1">
            Status: <span className="font-semibold">{stateData.status}</span>
          </div>
        </div>
      );
      
      // Set tooltip position
      setTooltipPosition({
        x: event.clientX + 10,
        y: event.clientY - 28
      });
      
      setTooltipVisible(true);
    }
  };
  
  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 4));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };
  
  const handleResetZoom = () => {
    setZoom(1);
  };
  
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-sm p-4 flex-1 min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            Geographic Distribution
          </h3>
        </div>
        <Skeleton className="w-full h-[400px]" />
      </Card>
    );
  }
  
  // Legend labels based on data view
  const getLegendLabels = () => {
    if (dataView === DataView.RATE) {
      return [
        { color: "#EDF8E9", label: "0-5" },
        { color: "#BAE4B3", label: "5-10" },
        { color: "#74C476", label: "10-15" },
        { color: "#31A354", label: "15-20" },
        { color: "#006D2C", label: "20+" }
      ];
    } else if (dataView === DataView.PERCENTAGE) {
      return [
        { color: "#EF4444", label: "-100% to -50%" },
        { color: "#F87171", label: "-50% to -10%" },
        { color: "#FECACA", label: "-10% to 0%" },
        { color: "#D1FAE5", label: "0% to 5%" },
        { color: "#6EE7B7", label: "5% to 15%" },
        { color: "#10B981", label: "15% to 30%" },
        { color: "#059669", label: "30%+" }
      ];
    } else {
      // Default: TOTAL
      return [
        { color: "#EDF8E9", label: "0-1,000" },
        { color: "#BAE4B3", label: "1,001-5,000" },
        { color: "#74C476", label: "5,001-15,000" },
        { color: "#31A354", label: "15,001-50,000" },
        { color: "#006D2C", label: "50,001+" }
      ];
    }
  };
  
  const legendItems = getLegendLabels();
  
  return (
    <Card className="bg-white rounded-lg shadow-sm flex-1 min-h-[500px]">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            Geographic Distribution
          </h3>
          <div className="flex items-center">
            <button 
              className="text-[#2C3E50] hover:text-opacity-80 p-1 rounded mr-2" 
              title="Zoom in"
              onClick={handleZoomIn}
            >
              <ZoomIn size={18} />
            </button>
            <button 
              className="text-[#2C3E50] hover:text-opacity-80 p-1 rounded mr-2" 
              title="Zoom out"
              onClick={handleZoomOut}
            >
              <ZoomOut size={18} />
            </button>
            <button 
              className="text-[#2C3E50] hover:text-opacity-80 p-1 rounded" 
              title="Reset view"
              onClick={handleResetZoom}
            >
              <Minimize size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center mb-4">
          <div className="flex flex-wrap items-center">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center mr-3 mb-1">
                <div 
                  className="w-4 h-4 mr-1.5 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          id="map-container" 
          className="w-full h-[400px] relative"
          ref={mapContainerRef}
        >
          <ComposableMap 
            projection="geoAlbersUsa"
            style={{ 
              width: "100%", 
              height: "100%", 
              transform: `scale(${zoom})`,
              transformOrigin: "center center"
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const stateId = geo.properties.postal;
                  const stateData = getStateData(stateId);
                  
                  // Determine fill color based on data view
                  let fillColor = "#EDF8E9"; // Default light color
                  
                  if (stateData) {
                    if (dataView === DataView.RATE) {
                      fillColor = colorScale(parseFloat(stateData.rate.toString()));
                    } else if (dataView === DataView.PERCENTAGE) {
                      fillColor = colorScale(parseFloat(stateData.change.toString()));
                    } else {
                      fillColor = colorScale(stateData.count);
                    }
                  }
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillColor}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: fillColor, opacity: 0.8 },
                        pressed: { outline: "none" }
                      }}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          
          {tooltipVisible && tooltipContent && (
            <div 
              className="absolute p-2.5 bg-white border border-gray-200 rounded shadow-lg z-50 max-w-[300px]"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translate(0, -100%)',
                opacity: 1
              }}
            >
              {tooltipContent}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-[#34495E] text-center">
          <p>Hover over states to see detailed information. Click on a state to view its full statistics.</p>
        </div>
      </CardContent>
    </Card>
  );
}
