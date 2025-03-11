import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatSummary {
  totalCount: number;
  averageRate: number;
  averageChange: number;
  topStates: {
    id: number;
    stateId: string;
    stateName: string;
    count: number;
  }[];
  legalStatus: {
    legal: { count: number; percentage: number };
    restricted: { count: number; percentage: number };
    banned: { count: number; percentage: number };
  };
}

interface StatsSummaryProps {
  summaryStats: StatSummary | undefined;
  isLoading: boolean;
}

export default function StatsSummary({ summaryStats, isLoading }: StatsSummaryProps) {
  if (isLoading || !summaryStats) {
    return (
      <Card className="bg-white rounded-lg shadow-sm p-4 w-full lg:w-80">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
          National Summary
        </h3>
        
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-sm w-full lg:w-80">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-[#2C3E50] mb-4" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
          National Summary
        </h3>
        
        <div className="border-b border-[#95A5A6] pb-4 mb-4">
          <p className="text-[#34495E] text-sm mb-2">Total Reported Abortions</p>
          <p className="text-3xl font-bold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            {summaryStats.totalCount.toLocaleString()}
          </p>
          <div className="flex items-center mt-1">
            <span className={`text-sm font-semibold ${summaryStats.averageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summaryStats.averageChange >= 0 ? (
                <ArrowUp className="inline mr-1" size={14} />
              ) : (
                <ArrowDown className="inline mr-1" size={14} />
              )}
              {Math.abs(summaryStats.averageChange).toFixed(1)}%
            </span>
            <span className="text-xs text-[#34495E] ml-2">from previous year</span>
          </div>
        </div>
        
        <div className="border-b border-[#95A5A6] pb-4 mb-4">
          <p className="text-[#34495E] text-sm mb-2">Average Rate</p>
          <p className="text-3xl font-bold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            {summaryStats.averageRate.toFixed(1)}
          </p>
          <p className="text-xs text-[#34495E]">per 1,000 women (15-44 years)</p>
        </div>
        
        <div className="border-b border-[#95A5A6] pb-4 mb-4">
          <p className="text-[#34495E] text-sm mb-2">States with Highest Counts</p>
          <ol className="mt-2 space-y-2">
            {summaryStats.topStates.map((state) => (
              <li key={state.stateId} className="flex justify-between">
                <span className="text-[#2C3E50] font-semibold">{state.stateName}</span>
                <span className="text-[#34495E]">{state.count.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </div>
        
        <div>
          <p className="text-[#34495E] text-sm mb-2">Legal Status Breakdown</p>
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Legal</span>
              <div className="flex-1 mx-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-[#74C476] rounded-full" 
                    style={{ width: `${summaryStats.legalStatus.legal.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold">{Math.round(summaryStats.legalStatus.legal.percentage)}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Restricted</span>
              <div className="flex-1 mx-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-[#BAE4B3] rounded-full" 
                    style={{ width: `${summaryStats.legalStatus.restricted.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold">{Math.round(summaryStats.legalStatus.restricted.percentage)}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Banned</span>
              <div className="flex-1 mx-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-red-500 rounded-full" 
                    style={{ width: `${summaryStats.legalStatus.banned.percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold">{Math.round(summaryStats.legalStatus.banned.percentage)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
