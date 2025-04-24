import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Briefcase,
  Eye,
  MessageSquare,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  interview: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  interview: <Calendar className="h-4 w-4" />,
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [sortBy, setSortBy] = useState("date_desc");
  const [jobs, setJobs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs first
        const { data: jobsData } = await supabase
          .from("job_listings")
          .select("id, title");
          
        // Create a lookup object
        const jobsMap = {};
        if (jobsData) {
          jobsData.forEach(job => {
            jobsMap[job.id] = job;
          });
        }
        setJobs(jobsMap);
        
        // Fetch applications with related data
        const { data, error } = await supabase
          .from("applications")
          .select(`
            id,
            status,
            created_at, 
            message,
            job_id,
            candidate_id,
            candidates (id, name, phone),
            job_listings (id, title)
          `);
          
        if (error) throw error;
        
        setApplications(data || []);
        applyFiltersAndSort(data || [], searchQuery, statusFilter, sortBy);
      } catch (error) {
        console.error("Error fetching applications:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Apply filters and sorting when any of these change
  useEffect(() => {
    applyFiltersAndSort(applications, searchQuery, statusFilter, sortBy);
  }, [searchQuery, statusFilter, sortBy]);

  const applyFiltersAndSort = (apps, search, status, sort) => {
    // First apply filters
    let result = apps;
    
    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(app => 
        (app.candidates?.name?.toLowerCase().includes(searchLower)) ||
        (app.job_listings?.title?.toLowerCase().includes(searchLower)) ||
        (app.message?.toLowerCase().includes(searchLower))
      );
    }
    
    // Status filter - updated to handle "all" value
    if (status && status !== "all") {
      result = result.filter(app => app.status === status);
    }
    
    // Apply sorting
    switch (sort) {
      case "date_asc":
        result = [...result].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "date_desc":
        result = [...result].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "name_asc":
        result = [...result].sort((a, b) => 
          (a.candidates?.name || "").localeCompare(b.candidates?.name || "")
        );
        break;
      case "name_desc":
        result = [...result].sort((a, b) => 
          (b.candidates?.name || "").localeCompare(a.candidates?.name || "")
        );
        break;
    }
    
    setFilteredApplications(result);
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", applicationId);
        
      if (error) throw error;
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      // Update filtered applications too
      setFilteredApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error("Error updating application status:", error.message);
    }
  };

  const viewApplicationDetails = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Prijave</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('hr-HR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input 
                  placeholder="Pretraži prijave..." 
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Svi statusi</SelectItem>
                    <SelectItem value="pending">Na čekanju</SelectItem>
                    <SelectItem value="approved">Odobreno</SelectItem>
                    <SelectItem value="rejected">Odbijeno</SelectItem>
                    <SelectItem value="interview">Intervju</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <SelectValue placeholder="Sortiraj" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Najnovije prvo</SelectItem>
                    <SelectItem value="date_asc">Najstarije prvo</SelectItem>
                    <SelectItem value="name_asc">Ime (A-Ž)</SelectItem>
                    <SelectItem value="name_desc">Ime (Ž-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700/40">
                    <div className="flex items-center gap-3 flex-1">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 md:mt-0">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredApplications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
                      <ClipboardList className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                      {searchQuery || statusFilter 
                        ? "Nema rezultata prema odabranim filterima" 
                        : "Nema prijava"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      {searchQuery || statusFilter 
                        ? "Pokušajte s drugačijim filterima ili pretraživanjem." 
                        : "Trenutno nema prijava kandidata za vaše poslove."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop view - Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kandidat</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posao</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Datum</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Akcije</th>
                          </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/40">
                          {filteredApplications.map((application) => (
                            <tr 
                              key={application.id} 
                              className="bg-white dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer"
                              onClick={() => viewApplicationDetails(application.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <User className="h-5 w-5 text-[#43AA8B]" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                      {application.candidates?.name || "Nepoznati kandidat"}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {application.candidates?.phone || "Bez kontakta"}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 max-w-[200px]">
                                  {application.job_listings?.title || `Job ID: ${application.job_id}`}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {new Date(application.created_at).toLocaleDateString("hr-HR")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                  <Select 
                                    value={application.status} 
                                    onValueChange={(value) => handleStatusChange(application.id, value)}
                                  >
                                    <SelectTrigger className={cn("w-[130px] text-xs px-2 h-8 bg-transparent border-none", statusColors[application.status])}>
                                      <div className="flex items-center gap-1">
                                        {statusIcons[application.status]}
                                        <SelectValue>
                                          {application.status === "pending" && "Na čekanju"}
                                          {application.status === "approved" && "Odobreno"}
                                          {application.status === "rejected" && "Odbijeno"}
                                          {application.status === "interview" && "Intervju"}
                                        </SelectValue>
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Na čekanju</SelectItem>
                                      <SelectItem value="approved">Odobreno</SelectItem>
                                      <SelectItem value="rejected">Odbijeno</SelectItem>
                                      <SelectItem value="interview">Intervju</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                    onClick={() => viewApplicationDetails(application.id)}>
                                    <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" 
                                    onClick={() => viewApplicationDetails(application.id)}>
                                    <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Mobile view - Cards */}
                    <div className="md:hidden space-y-4 p-4">
                      {filteredApplications.map((application) => (
                        <div 
                          key={application.id}
                          onClick={() => viewApplicationDetails(application.id)}
                          className="bg-white dark:bg-gray-800/20 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700/30 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-[#43AA8B]" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                                  {application.candidates?.name || "Nepoznati kandidat"}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {application.candidates?.phone || "Bez kontakta"}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              className={cn(
                                "h-6 text-xs font-medium",
                                statusColors[application.status]
                              )}
                            >
                              <span className="flex items-center gap-1">
                                {statusIcons[application.status]}
                                {application.status === "pending" && "Na čekanju"}
                                {application.status === "approved" && "Odobreno"}
                                {application.status === "rejected" && "Odbijeno"}
                                {application.status === "interview" && "Intervju"}
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="mb-3 border-t border-gray-100 dark:border-gray-700/30 pt-2">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posao:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                              {application.job_listings?.title || `Job ID: ${application.job_id}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span>{new Date(application.created_at).toLocaleDateString("hr-HR")}</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Applications;