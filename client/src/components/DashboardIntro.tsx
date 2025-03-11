import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function DashboardIntro() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  
  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 
              className="text-xl font-semibold text-[#2C3E50] mb-2"
              style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
            >
              Abortion Statistics Across the United States
            </h2>
            <p className="text-[#34495E] mb-4" style={{ fontFamily: '"Source Sans Pro", sans-serif' }}>
              Interactive visualization of current year's abortion data by state.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className="text-sm text-[#34495E]">
              Last updated: <span className="font-semibold">{currentDate}</span>
            </span>
            
            <button 
              className="text-[#2C3E50] hover:text-opacity-80 p-1 rounded"
              title="More information"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
