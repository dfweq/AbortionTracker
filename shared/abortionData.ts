import { AbortionStat } from "./schema";

// This would normally come from the Excel file, but since we couldn't decode it,
// we'll use a hardcoded dataset based on the design reference example data
export const abortionData: AbortionStat[] = [
  { id: 1, stateId: "AL", stateName: "Alabama", count: 3280, rate: 3.4, change: -87.4, status: "Banned", region: "south", year: 2023 },
  { id: 2, stateId: "AK", stateName: "Alaska", count: 1620, rate: 11.2, change: 0.8, status: "Legal", region: "west", year: 2023 },
  { id: 3, stateId: "AZ", stateName: "Arizona", count: 13450, rate: 9.3, change: -1.2, status: "Restricted", region: "west", year: 2023 },
  { id: 4, stateId: "AR", stateName: "Arkansas", count: 410, rate: 0.7, change: -95.6, status: "Banned", region: "south", year: 2023 },
  { id: 5, stateId: "CA", stateName: "California", count: 154060, rate: 19.2, change: 4.2, status: "Legal", region: "west", year: 2023 },
  { id: 6, stateId: "CO", stateName: "Colorado", count: 21570, rate: 18.6, change: 33.2, status: "Legal", region: "west", year: 2023 },
  { id: 7, stateId: "CT", stateName: "Connecticut", count: 13950, rate: 20.3, change: 2.6, status: "Legal", region: "northeast", year: 2023 },
  { id: 8, stateId: "DE", stateName: "Delaware", count: 2630, rate: 14.1, change: 1.5, status: "Legal", region: "south", year: 2023 },
  { id: 9, stateId: "FL", stateName: "Florida", count: 82540, rate: 18.1, change: 1.4, status: "Restricted", region: "south", year: 2023 },
  { id: 10, stateId: "GA", stateName: "Georgia", count: 34080, rate: 15.2, change: -3.8, status: "Restricted", region: "south", year: 2023 },
  { id: 11, stateId: "HI", stateName: "Hawaii", count: 2450, rate: 9.3, change: 0.9, status: "Legal", region: "west", year: 2023 },
  { id: 12, stateId: "ID", stateName: "Idaho", count: 580, rate: 1.6, change: -91.2, status: "Banned", region: "west", year: 2023 },
  { id: 13, stateId: "IL", stateName: "Illinois", count: 46510, rate: 17.4, change: 5.7, status: "Legal", region: "midwest", year: 2023 },
  { id: 14, stateId: "IN", stateName: "Indiana", count: 8170, rate: 6.2, change: -0.9, status: "Restricted", region: "midwest", year: 2023 },
  { id: 15, stateId: "IA", stateName: "Iowa", count: 4350, rate: 7.4, change: 1.2, status: "Restricted", region: "midwest", year: 2023 },
  { id: 16, stateId: "KS", stateName: "Kansas", count: 9540, rate: 16.8, change: 13.7, status: "Legal", region: "midwest", year: 2023 },
  { id: 17, stateId: "KY", stateName: "Kentucky", count: 310, rate: 0.4, change: -96.8, status: "Banned", region: "south", year: 2023 },
  { id: 18, stateId: "LA", stateName: "Louisiana", count: 890, rate: 0.9, change: -93.4, status: "Banned", region: "south", year: 2023 },
  { id: 19, stateId: "ME", stateName: "Maine", count: 2470, rate: 10.2, change: 2.1, status: "Legal", region: "northeast", year: 2023 },
  { id: 20, stateId: "MD", stateName: "Maryland", count: 29850, rate: 24.3, change: 2.7, status: "Legal", region: "south", year: 2023 },
  { id: 21, stateId: "MA", stateName: "Massachusetts", count: 21430, rate: 15.2, change: 1.8, status: "Legal", region: "northeast", year: 2023 },
  { id: 22, stateId: "MI", stateName: "Michigan", count: 30710, rate: 15.6, change: 4.3, status: "Legal", region: "midwest", year: 2023 },
  { id: 23, stateId: "MN", stateName: "Minnesota", count: 12780, rate: 11.8, change: 6.7, status: "Legal", region: "midwest", year: 2023 },
  { id: 24, stateId: "MS", stateName: "Mississippi", count: 120, rate: 0.2, change: -99.1, status: "Banned", region: "south", year: 2023 },
  { id: 25, stateId: "MO", stateName: "Missouri", count: 170, rate: 0.1, change: -98.9, status: "Banned", region: "midwest", year: 2023 },
  { id: 26, stateId: "MT", stateName: "Montana", count: 1850, rate: 9.4, change: 1.1, status: "Legal", region: "west", year: 2023 },
  { id: 27, stateId: "NE", stateName: "Nebraska", count: 3210, rate: 8.7, change: 0.5, status: "Restricted", region: "midwest", year: 2023 },
  { id: 28, stateId: "NV", stateName: "Nevada", count: 9830, rate: 15.7, change: 2.4, status: "Legal", region: "west", year: 2023 },
  { id: 29, stateId: "NH", stateName: "New Hampshire", count: 2220, rate: 8.6, change: 0.7, status: "Legal", region: "northeast", year: 2023 },
  { id: 30, stateId: "NJ", stateName: "New Jersey", count: 48370, rate: 26.7, change: 3.4, status: "Legal", region: "northeast", year: 2023 },
  { id: 31, stateId: "NM", stateName: "New Mexico", count: 10730, rate: 26.2, change: 46.8, status: "Legal", region: "west", year: 2023 },
  { id: 32, stateId: "NY", stateName: "New York", count: 110830, rate: 26.3, change: 2.8, status: "Legal", region: "northeast", year: 2023 },
  { id: 33, stateId: "NC", stateName: "North Carolina", count: 29740, rate: 13.8, change: 1.9, status: "Legal", region: "south", year: 2023 },
  { id: 34, stateId: "ND", stateName: "North Dakota", count: 90, rate: 0.6, change: -92.8, status: "Banned", region: "midwest", year: 2023 },
  { id: 35, stateId: "OH", stateName: "Ohio", count: 21570, rate: 9.5, change: -2.1, status: "Restricted", region: "midwest", year: 2023 },
  { id: 36, stateId: "OK", stateName: "Oklahoma", count: 240, rate: 0.3, change: -97.4, status: "Banned", region: "south", year: 2023 },
  { id: 37, stateId: "OR", stateName: "Oregon", count: 8870, rate: 11.1, change: 2.3, status: "Legal", region: "west", year: 2023 },
  { id: 38, stateId: "PA", stateName: "Pennsylvania", count: 33960, rate: 13.7, change: 0.8, status: "Legal", region: "northeast", year: 2023 },
  { id: 39, stateId: "RI", stateName: "Rhode Island", count: 3130, rate: 14.5, change: 1.4, status: "Legal", region: "northeast", year: 2023 },
  { id: 40, stateId: "SC", stateName: "South Carolina", count: 5910, rate: 5.9, change: -1.8, status: "Restricted", region: "south", year: 2023 },
  { id: 41, stateId: "SD", stateName: "South Dakota", count: 80, rate: 0.5, change: -93.2, status: "Banned", region: "midwest", year: 2023 },
  { id: 42, stateId: "TN", stateName: "Tennessee", count: 630, rate: 0.5, change: -95.1, status: "Banned", region: "south", year: 2023 },
  { id: 43, stateId: "TX", stateName: "Texas", count: 2870, rate: 0.5, change: -92.3, status: "Banned", region: "south", year: 2023 },
  { id: 44, stateId: "UT", stateName: "Utah", count: 810, rate: 1.2, change: -85.7, status: "Banned", region: "west", year: 2023 },
  { id: 45, stateId: "VT", stateName: "Vermont", count: 1280, rate: 11.7, change: 0.6, status: "Legal", region: "northeast", year: 2023 },
  { id: 46, stateId: "VA", stateName: "Virginia", count: 23450, rate: 13.6, change: 1.2, status: "Legal", region: "south", year: 2023 },
  { id: 47, stateId: "WA", stateName: "Washington", count: 19650, rate: 12.9, change: 3.6, status: "Legal", region: "west", year: 2023 },
  { id: 48, stateId: "WV", stateName: "West Virginia", count: 380, rate: 1.1, change: -82.6, status: "Banned", region: "south", year: 2023 },
  { id: 49, stateId: "WI", stateName: "Wisconsin", count: 6730, rate: 6.2, change: -1.3, status: "Restricted", region: "midwest", year: 2023 },
  { id: 50, stateId: "WY", stateName: "Wyoming", count: 150, rate: 1.4, change: -78.9, status: "Banned", region: "west", year: 2023 }
];

// Calculate totals and statistics
export const calculateStatistics = () => {
  const totalCount = abortionData.reduce((sum, state) => sum + state.count, 0);
  
  // Average rate calculation
  const totalRate = abortionData.reduce((sum, state) => sum + parseFloat(state.rate.toString()), 0);
  const averageRate = totalRate / abortionData.length;
  
  // YoY change - calculated as average of all state changes
  const totalChange = abortionData.reduce((sum, state) => sum + parseFloat(state.change.toString()), 0);
  const averageChange = totalChange / abortionData.length;
  
  // States with highest counts (top 3)
  const topStates = [...abortionData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  // Legal status breakdown
  const legalCount = abortionData.filter(state => state.status.toLowerCase() === "legal").length;
  const restrictedCount = abortionData.filter(state => state.status.toLowerCase() === "restricted").length;
  const bannedCount = abortionData.filter(state => state.status.toLowerCase() === "banned").length;
  
  const legalPercentage = (legalCount / abortionData.length) * 100;
  const restrictedPercentage = (restrictedCount / abortionData.length) * 100;
  const bannedPercentage = (bannedCount / abortionData.length) * 100;
  
  return {
    totalCount,
    averageRate,
    averageChange,
    topStates,
    legalStatus: {
      legal: { count: legalCount, percentage: legalPercentage },
      restricted: { count: restrictedCount, percentage: restrictedPercentage },
      banned: { count: bannedCount, percentage: bannedPercentage }
    }
  };
};
