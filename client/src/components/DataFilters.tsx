import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Region, LegalStatus, DataView } from "@shared/schema";

interface DataFiltersProps {
  region: Region;
  legalStatus: LegalStatus;
  dataView: DataView;
  onApplyFilters: (region: Region, legalStatus: LegalStatus, dataView: DataView) => void;
}

export default function DataFilters({ 
  region: initialRegion,
  legalStatus: initialLegalStatus, 
  dataView: initialDataView,
  onApplyFilters 
}: DataFiltersProps) {
  // Local state for form values before they are submitted
  const [region, setRegion] = useState<Region>(initialRegion);
  const [legalStatus, setLegalStatus] = useState<LegalStatus>(initialLegalStatus);
  const [dataView, setDataView] = useState<DataView>(initialDataView);
  
  const handleApplyFilters = () => {
    onApplyFilters(region, legalStatus, dataView);
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[180px]">
            <Label 
              htmlFor="regionFilter" 
              className="block text-sm font-semibold text-[#34495E] mb-1"
            >
              Region
            </Label>
            <Select 
              value={region} 
              onValueChange={(value) => setRegion(value as Region)}
            >
              <SelectTrigger id="regionFilter" className="w-full border border-[#95A5A6] rounded p-2 text-[#2C3E50]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Region.ALL}>All Regions</SelectItem>
                <SelectItem value={Region.NORTHEAST}>Northeast</SelectItem>
                <SelectItem value={Region.MIDWEST}>Midwest</SelectItem>
                <SelectItem value={Region.SOUTH}>South</SelectItem>
                <SelectItem value={Region.WEST}>West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[180px]">
            <Label 
              htmlFor="legalStatusFilter" 
              className="block text-sm font-semibold text-[#34495E] mb-1"
            >
              Legal Status
            </Label>
            <Select 
              value={legalStatus}
              onValueChange={(value) => setLegalStatus(value as LegalStatus)}
            >
              <SelectTrigger id="legalStatusFilter" className="w-full border border-[#95A5A6] rounded p-2 text-[#2C3E50]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LegalStatus.ALL}>All Statuses</SelectItem>
                <SelectItem value={LegalStatus.LEGAL}>Legal</SelectItem>
                <SelectItem value={LegalStatus.RESTRICTED}>Restricted</SelectItem>
                <SelectItem value={LegalStatus.BANNED}>Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[180px]">
            <Label 
              htmlFor="dataView" 
              className="block text-sm font-semibold text-[#34495E] mb-1"
            >
              Data View
            </Label>
            <Select 
              value={dataView}
              onValueChange={(value) => setDataView(value as DataView)}
            >
              <SelectTrigger id="dataView" className="w-full border border-[#95A5A6] rounded p-2 text-[#2C3E50]">
                <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DataView.TOTAL}>Total Count</SelectItem>
                <SelectItem value={DataView.RATE}>Rate per 1,000 women</SelectItem>
                <SelectItem value={DataView.PERCENTAGE}>Percentage Change YoY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              className="bg-[#2C3E50] hover:bg-opacity-90 text-white px-4 py-2 rounded"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
