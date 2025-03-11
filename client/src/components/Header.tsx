import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const currentYear = new Date().getFullYear();
  
  return (
    <header className="bg-[#2C3E50] text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-2xl font-bold" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
              US Abortion Statistics Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-lg" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
              {currentYear}
            </span>
            
            <Button variant="secondary" className="bg-[#34495E] hover:bg-opacity-80 text-white">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
