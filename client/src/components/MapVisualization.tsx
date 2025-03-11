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
  
  // Simplified mouse hover handling with property name detection
  const handleMouseEnter = (geo: any) => {
    try {
      // First check if geo exists and has properties
      if (!geo || !geo.properties) {
        console.warn("Invalid geography on hover");
        return;
      }
      
      const props = geo.properties;
      console.log("Hover props:", props);
      
      // Try various property names for state ID
      let stateId = null;
      
      if (props.postal) stateId = props.postal;
      else if (props.STUSPS) stateId = props.STUSPS;
      else if (props.STATE_ABBR) stateId = props.STATE_ABBR;
      else if (props.state) stateId = props.state;
      else if (props.abbr) stateId = props.abbr;
      
      // Special case for some GeoJSON formats - use the name to map to state code
      if (!stateId && props.name) {
        const stateName = props.name;
        const stateMap: {[key: string]: string} = {
          "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
          "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
          "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
          "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
          "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
          "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
          "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
          "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
          "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
          "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
        };
        
        if (stateMap[stateName]) {
          stateId = stateMap[stateName];
          console.log(`Mapped state name "${stateName}" to code "${stateId}"`);
        }
      }
      
      if (!stateId) {
        console.warn("Couldn't find state ID in properties:", props);
        return;
      }
      
      console.log("Using state ID:", stateId);
      const stateData = getStateData(stateId);
      
      console.log("State hover:", stateId, stateData);
      
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
              YoY Change: <span className={`font-semibold ${parseFloat(stateData.change.toString()) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(stateData.change.toString()) >= 0 ? '+' : ''}{stateData.change}%
              </span>
            </div>
            <div className="text-sm mt-1">
              Status: <span className="font-semibold">{stateData.status}</span>
            </div>
          </div>
        );
        
        // Use current mouse position from global event
        const updateTooltipPosition = (e: MouseEvent) => {
          setTooltipPosition({ 
            x: e.clientX + 10,  // Offset slightly to not cover the cursor
            y: e.clientY + 10
          });
        };
        
        // Add a global mousemove listener
        document.addEventListener('mousemove', updateTooltipPosition);
        
        // Get initial position from current mouse position or use a default position
        if (window.event) {
          updateTooltipPosition(window.event as MouseEvent);
        } else {
          // If window.event is not available, set a default position
          setTooltipPosition({ x: 100, y: 100 });
        }
        
        // Make tooltip visible
        setTooltipVisible(true);
        
        // Clean up the event listener when mouse leaves
        setTimeout(() => {
          const handleMouseMove = (e: MouseEvent) => {
            updateTooltipPosition(e);
          };
          
          // Store the event listener to remove it on mouse leave
          (window as any).currentTooltipMoveHandler = handleMouseMove;
          document.addEventListener('mousemove', handleMouseMove);
        }, 0);
      } else {
        console.warn(`No tooltip data available for ${stateId || 'unknown state'}`);
      }
    } catch (error) {
      console.error("Error in handleMouseEnter:", error);
    }
  };
  
  const handleMouseLeave = () => {
    // Clean up event listener if it exists
    if ((window as any).currentTooltipMoveHandler) {
      document.removeEventListener('mousemove', (window as any).currentTooltipMoveHandler);
      (window as any).currentTooltipMoveHandler = null;
    }
    setTooltipVisible(false);
  };
  
  // Handle state click for detailed view with deep debugging
  const handleStateClick = (geo: any) => {
    console.log("State clicked:", geo);
    
    try {
      // First check if geo exists and has properties
      if (!geo || !geo.properties) {
        console.warn("Invalid geography clicked");
        return;
      }
      
      const { properties } = geo;
      
      // DEBUG: Log all properties to find the correct state ID property
      console.log("All properties:", properties);
      
      // Try various property names for state ID
      let stateId = null;
      
      if (properties.postal) {
        stateId = properties.postal;
      } else if (properties.STUSPS) {
        stateId = properties.STUSPS;
      } else if (properties.STATE_ABBR) {
        stateId = properties.STATE_ABBR;
      } else if (properties.state) {
        stateId = properties.state;
      } else if (properties.abbr) {
        stateId = properties.abbr;
      }
      
      // Special case for some GeoJSON formats - use the name to map to state code
      if (!stateId && properties.name) {
        const stateName = properties.name;
        const stateMap: {[key: string]: string} = {
          "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
          "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
          "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
          "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
          "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
          "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
          "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
          "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
          "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
          "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
        };
        
        if (stateMap[stateName]) {
          stateId = stateMap[stateName];
          console.log(`Mapped state name "${stateName}" to code "${stateId}" for click`);
        }
      }
      
      if (!stateId) {
        console.warn("Could not find state ID in properties:", properties);
        return;
      }
      
      console.log("Found State ID:", stateId);
      
      // Find the state data
      const stateData = getStateData(stateId);
      console.log("State data:", stateData);
      
      if (stateData) {
        // Create message with all state data properties
        const message = `Detailed statistics for ${stateData.stateName}:\n` +
              `Total Count: ${stateData.count.toLocaleString()}\n` +
              `Rate per 1,000 women: ${stateData.rate}\n` +
              `Year-over-Year Change: ${stateData.change}%\n` +
              `Legal Status: ${stateData.status}`;
        
        console.log("Showing alert with message:", message);
        // Use window.alert to ensure it's the browser's native alert
        window.alert(message);
      } else {
        console.warn(`No data available for ${stateId || 'unknown state'}`);
      }
    } catch (error) {
      console.error("Error in handleStateClick:", error);
    }
  };

  // Zoom controls - with debugging
  const handleZoomIn = () => {
    console.log("Zoom in clicked");
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.5, 4);
      console.log(`Zoom level changed from ${prev} to ${newZoom}`);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    console.log("Zoom out clicked");
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 0.5);
      console.log(`Zoom level changed from ${prev} to ${newZoom}`);
      return newZoom;
    });
  };
  
  const handleResetZoom = () => {
    console.log("Reset zoom clicked");
    setZoom(1);
    console.log("Zoom level reset to 1");
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
            <div 
              className="text-[#2C3E50] hover:bg-gray-100 p-2 rounded mr-2 cursor-pointer"
              title="Zoom in"
              onClick={handleZoomIn}
            >
              <ZoomIn size={18} />
            </div>
            <div 
              className="text-[#2C3E50] hover:bg-gray-100 p-2 rounded mr-2 cursor-pointer"
              title="Zoom out"
              onClick={handleZoomOut}
            >
              <ZoomOut size={18} />
            </div>
            <div 
              className="text-[#2C3E50] hover:bg-gray-100 p-2 rounded cursor-pointer"
              title="Reset view"
              onClick={handleResetZoom}
            >
              <Minimize size={18} />
            </div>
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
                  // Debug: Log the first few geo objects
                  if (!(window as any).geoLogShown) {
                    console.log("GEO OBJECT SAMPLE:", geo);
                    (window as any).geoLogShown = true;
                  }
                  
                  // Try various property names for state ID
                  let stateId = null;
                  const props = geo.properties;
                  
                  // US Atlas uses 'name' for the state name and postal for the abbr
                  if (props.name && props.postal) {
                    console.log(`State name: ${props.name}, postal: ${props.postal}`);
                  }
                  
                  if (props.postal) stateId = props.postal;
                  else if (props.STUSPS) stateId = props.STUSPS;
                  else if (props.STATE_ABBR) stateId = props.STATE_ABBR;
                  else if (props.state) stateId = props.state;
                  else if (props.abbr) stateId = props.abbr;
                  
                  // Special case for some GeoJSON formats
                  if (props.name) {
                    const stateName = props.name;
                    const stateMap: {[key: string]: string} = {
                      "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
                      "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
                      "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
                      "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
                      "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
                      "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
                      "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
                      "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
                      "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
                      "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
                    };
                    if (stateMap[stateName]) {
                      stateId = stateMap[stateName];
                    }
                  }
                  
                  const stateData = stateId ? getStateData(stateId) : null;
                  
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
                        default: { outline: "none", cursor: "pointer" },
                        hover: { outline: "none", fill: fillColor, opacity: 0.8, cursor: "pointer" },
                        pressed: { outline: "none", cursor: "pointer" }
                      }}
                      onMouseEnter={() => handleMouseEnter(geo)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleStateClick(geo)}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          
          {tooltipVisible && tooltipContent && (
            <div 
              className="fixed p-2.5 bg-white border border-gray-200 rounded shadow-lg z-50 max-w-[300px]"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                pointerEvents: 'none',
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
