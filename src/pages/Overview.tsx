import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Users, ClipboardList, ChevronRight, Calendar, TrendingUp, BarChart3 } from "lucide-react";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const Overview = () => {
  const [locations, setLocations] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: locationsData } = await supabase.from("locations").select("*");
        setLocations(locationsData || []);

        const { data: jobListingsData } = await supabase.from("job_listings").select("*");
        setJobListings(jobListingsData || []);

        const { data: candidatesData } = await supabase.from("candidates").select("*");
        setCandidates(candidatesData || []);

        const { data: applicationsData } = await supabase
          .from("applications")
          .select(`
            id,
            status,
            created_at,
            message,
            job_id,
            candidates (name),
            job_listings (id, title)
          `); // Ensure `job_id` and `job_listings` are properly joined
        setApplications(applicationsData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-6 md:p-8">
          
          {/* Modern header with title and date */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Pregled</h1>
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
            <div className="flex gap-2">
              <Card className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700/50">
                <TrendingUp className="h-4 w-4 text-[#43AA8B]" />
                <span>Posljednji mjesec</span>
              </Card>
            </div>
          </div>

          {loading ? (
            <div className="space-y-8">
              {/* Stats cards skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <Skeleton className="h-10 w-10 mb-4 rounded-lg" />
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </Card>
                ))}
              </div>

              {/* Content skeletons */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <Skeleton className="h-7 w-48 mb-6" />
                  <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <BarChart3 className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                  </div>
                </Card>
                
                <Card className="p-6 h-fit backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <Skeleton className="h-7 w-40 mb-4" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 my-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          ) : (
            <>
              {/* Modern statistics cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                <Card className="overflow-hidden relative shadow-sm border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 z-0" />
                  <div className="relative z-10 p-3 md:p-6">
                    <div className="p-1 md:p-2 bg-green-100 dark:bg-green-800/30 rounded-xl w-fit mb-2 md:mb-4">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#43AA8B]" />
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ukupno lokacija</h3>
                    <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">{locations.length}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#43AA8B]/50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                </Card>
                
                <Card className="overflow-hidden relative shadow-sm border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 z-0" />
                  <div className="relative z-10 p-3 md:p-6">
                    <div className="p-1 md:p-2 bg-green-100 dark:bg-green-800/30 rounded-xl w-fit mb-2 md:mb-4">
                      <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-[#43AA8B]" />
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ukupno oglasa</h3>
                    <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">{jobListings.length}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#43AA8B]/50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                </Card>
                
                <Card className="overflow-hidden relative shadow-sm border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 z-0" />
                  <div className="relative z-10 p-3 md:p-6">
                    <div className="p-1 md:p-2 bg-green-100 dark:bg-green-800/30 rounded-xl w-fit mb-2 md:mb-4">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-[#43AA8B]" />
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ukupno kandidata</h3>
                    <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">{candidates.length}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#43AA8B]/50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                </Card>
                
                <Card className="overflow-hidden relative shadow-sm border-0 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 z-0" />
                  <div className="relative z-10 p-3 md:p-6">
                    <div className="p-1 md:p-2 bg-green-100 dark:bg-green-800/30 rounded-xl w-fit mb-2 md:mb-4">
                      <ClipboardList className="h-4 w-4 md:h-5 md:w-5 text-[#43AA8B]" />
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ukupno prijava</h3>
                    <p className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">{applications.length}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#43AA8B]/50 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100" />
                </Card>
              </div>
              
              {/* Content panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent applications */}
                <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Nedavne prijave</h2>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {applications.slice(0, 5).map((application) => (
                      <div
                        key={application.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {application.candidates?.name || "Nepoznati kandidat"}
                          </h3>
                          <span className={cn(
                            "text-xs font-medium rounded-full px-2 py-0.5",
                            application.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300" : 
                            application.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300" : 
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300"
                          )}>
                            {application.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {application.job_listings?.title || "Nepoznati posao"}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(application.created_at).toLocaleDateString("hr-HR")}
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
                    <Link to="/applications" className="text-[#43AA8B] text-sm font-medium flex items-center hover:underline">
                      Vidi sve prijave
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </Card>

                {/* Popular jobs */}
                <Card className="lg:col-span-2 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Popularni poslovi</h2>
                  </div>
                  <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-700/50">
                    {jobListings.slice(0, 5).map((job) => {
                      const jobApplications = applications.filter((app) => app.job_id === job.id);
                      return (
                        <div
                          key={job.id}
                          className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                          onClick={() => navigate(`/jobs/${job.id}`)} // Changed to use navigate for consistent behavior
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                                {job.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Objavljeno {new Date(job.created_at).toLocaleDateString("hr-HR")}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 text-[#43AA8B] font-medium">
                                {jobApplications.length}
                              </span>
                              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
                    <Link to="/jobs" className="text-[#43AA8B] text-sm font-medium flex items-center hover:underline">
                      Vidi sve poslove
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Overview;
