import Header from "@/components/Header";
import DashboardIntro from "@/components/DashboardIntro";
import DataFilters from "@/components/DataFilters";
import MapVisualization from "@/components/MapVisualization";
import StatsSummary from "@/components/StatsSummary";
import DataTable from "@/components/DataTable";
import MethodologyNote from "@/components/MethodologyNote";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AbortionStat, Region, LegalStatus, DataView } from "@shared/schema";

export default function Dashboard() {
  // State for filters
  const [region, setRegion] = useState<Region>(Region.ALL);
  const [legalStatus, setLegalStatus] = useState<LegalStatus>(LegalStatus.ALL);
  const [dataView, setDataView] = useState<DataView>(DataView.TOTAL);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch abortion statistics with filters
  const { data: abortionStats, isLoading: statsLoading } = useQuery<AbortionStat[]>({
    queryKey: ['/api/abortion-stats/filtered', { region, legalStatus, dataView, searchTerm }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      if (legalStatus) params.append('legalStatus', legalStatus);
      if (dataView) params.append('dataView', dataView);
      if (searchTerm) params.append('searchTerm', searchTerm);
      
      const response = await fetch(`/api/abortion-stats/filtered?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch abortion statistics');
      return response.json();
    }
  });
  
  // Fetch summary statistics
  const { data: summaryStats, isLoading: summaryLoading } = useQuery({
    queryKey: ['/api/abortion-stats/summary'],
    queryFn: async () => {
      const response = await fetch('/api/abortion-stats/summary');
      if (!response.ok) throw new Error('Failed to fetch summary statistics');
      return response.json();
    }
  });

  // Handler for applying filters
  const applyFilters = (
    newRegion: Region,
    newLegalStatus: LegalStatus,
    newDataView: DataView
  ) => {
    setRegion(newRegion);
    setLegalStatus(newLegalStatus);
    setDataView(newDataView);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <DashboardIntro />
        
        <DataFilters 
          region={region}
          legalStatus={legalStatus}
          dataView={dataView}
          onApplyFilters={applyFilters}
        />
        
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <MapVisualization 
            abortionStats={abortionStats || []} 
            isLoading={statsLoading}
            dataView={dataView}
          />
          
          <StatsSummary 
            summaryStats={summaryStats}
            isLoading={summaryLoading} 
          />
        </div>
        
        <DataTable 
          abortionStats={abortionStats || []} 
          isLoading={statsLoading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <MethodologyNote />
      </main>
      
      <Footer />
    </div>
  );
}
