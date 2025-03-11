import { Card, CardContent } from "@/components/ui/card";
import { Download, Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AbortionStat } from "@shared/schema";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  abortionStats: AbortionStat[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function DataTable({ 
  abortionStats, 
  isLoading, 
  searchTerm, 
  onSearchChange 
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("stateName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;
  
  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);
  
  // Handle sorting logic
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      setSortBy(column);
      setSortDirection("asc");
    }
  };
  
  // Apply sorting to the data
  const sortedData = [...abortionStats].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case "stateName":
        valueA = a.stateName;
        valueB = b.stateName;
        break;
      case "count":
        valueA = a.count;
        valueB = b.count;
        break;
      case "rate":
        valueA = parseFloat(a.rate.toString());
        valueB = parseFloat(b.rate.toString());
        break;
      case "change":
        valueA = parseFloat(a.change.toString());
        valueB = parseFloat(b.change.toString());
        break;
      case "status":
        valueA = a.status;
        valueB = b.status;
        break;
      default:
        valueA = a.stateName;
        valueB = b.stateName;
    }
    
    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentPageData = sortedData.slice(start, end);
  
  // Generate page numbers
  const getPageNumbers = () => {
    const maxVisiblePages = 3;
    let pageNumbers = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // More complex pagination with current page in the middle
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, page - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if at end of range
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };
  
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };
  
  if (isLoading) {
    return (
      <Card className="bg-white rounded-lg shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
              State-by-State Data
            </h3>
          </div>
          
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#2C3E50]" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>
            State-by-State Data
          </h3>
          
          <div className="flex items-center">
            <div className="relative mr-4">
              <Input
                type="text"
                placeholder="Search states..."
                className="pl-8 pr-2 py-1 border border-[#95A5A6] rounded focus:outline-none focus:ring-1 focus:ring-[#2C3E50] text-sm"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <Search className="text-[#95A5A6] absolute left-2 top-1/2 transform -translate-y-1/2" size={16} />
            </div>
            
            <Button variant="ghost" className="text-[#2C3E50] hover:text-opacity-80 p-1 rounded">
              <Download size={18} />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-[#34495E] uppercase tracking-wider"
                  onClick={() => handleSort("stateName")}
                >
                  <div className="flex items-center cursor-pointer">
                    State
                    <span className={`ml-1 ${sortBy === "stateName" ? "text-[#31A354]" : ""}`}>
                      {sortBy === "stateName" && sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : sortBy === "stateName" && sortDirection === "desc" ? (
                        <ArrowDown size={14} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-[#34495E] uppercase tracking-wider"
                  onClick={() => handleSort("count")}
                >
                  <div className="flex items-center cursor-pointer">
                    Total Count
                    <span className={`ml-1 ${sortBy === "count" ? "text-[#31A354]" : ""}`}>
                      {sortBy === "count" && sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : sortBy === "count" && sortDirection === "desc" ? (
                        <ArrowDown size={14} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-[#34495E] uppercase tracking-wider"
                  onClick={() => handleSort("rate")}
                >
                  <div className="flex items-center cursor-pointer">
                    Rate per 1,000
                    <span className={`ml-1 ${sortBy === "rate" ? "text-[#31A354]" : ""}`}>
                      {sortBy === "rate" && sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : sortBy === "rate" && sortDirection === "desc" ? (
                        <ArrowDown size={14} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-[#34495E] uppercase tracking-wider"
                  onClick={() => handleSort("change")}
                >
                  <div className="flex items-center cursor-pointer">
                    YoY Change
                    <span className={`ml-1 ${sortBy === "change" ? "text-[#31A354]" : ""}`}>
                      {sortBy === "change" && sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : sortBy === "change" && sortDirection === "desc" ? (
                        <ArrowDown size={14} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-[#34495E] uppercase tracking-wider"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center cursor-pointer">
                    Legal Status
                    <span className={`ml-1 ${sortBy === "status" ? "text-[#31A354]" : ""}`}>
                      {sortBy === "status" && sortDirection === "asc" ? (
                        <ArrowUp size={14} />
                      ) : sortBy === "status" && sortDirection === "desc" ? (
                        <ArrowDown size={14} />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      )}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPageData.map((state) => (
                <tr key={state.stateId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#2C3E50]">{state.stateName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#2C3E50]">{state.count.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#2C3E50]">{state.rate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${state.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {state.change >= 0 ? '+' : ''}{state.change}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        state.status === "Legal" 
                          ? "bg-green-100 text-green-800" 
                          : state.status === "Restricted"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {state.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm">
          <div>
            <span className="text-[#34495E]">
              Showing {start + 1}-{Math.min(end, sortedData.length)} of {sortedData.length} states
            </span>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 border border-[#95A5A6] rounded text-[#2C3E50]"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            
            {getPageNumbers().map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                className={`px-3 py-1 border border-[#95A5A6] rounded ${
                  pageNum === page 
                    ? "text-white bg-[#2C3E50]" 
                    : "text-[#2C3E50]"
                }`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              className="px-3 py-1 border border-[#95A5A6] rounded text-[#2C3E50]"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
