import { Card, CardContent } from "@/components/ui/card";

export default function MethodologyNote() {
  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardContent className="p-4">
        <h3 
          className="text-lg font-semibold text-[#2C3E50] mb-3"
          style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
        >
          Data Methodology & Notes
        </h3>
        
        <div className="text-sm text-[#34495E] space-y-2">
          <p>
            Data collected from state health departments and the Guttmacher Institute. 
            Figures represent the most recent available estimates for 2023.
          </p>
          <p>
            Some states may have incomplete reporting due to various factors including legal 
            restrictions, reporting delays, or different methodologies.
          </p>
          <p>
            Rates are calculated as the number of abortions per 1,000 women aged 15-44 years 
            residing in the state.
          </p>
          <p>
            Legal status indicates the general availability of abortion services in each state as 
            of the reporting period.
          </p>
          <p className="text-xs mt-4">
            Last updated: July 15, 2023 | Source: Guttmacher Institute, State Health Departments
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
