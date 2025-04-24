import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  Briefcase,
  MapPin,
  Users,
  Clock,
  Plus,
  ChevronRight,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { getCurrentEmployerId } from '@/utils/authUtils';

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Dohvati ID trenutnog poslodavca
        const employerId = await getCurrentEmployerId();
        
        if (!employerId) {
          console.error("Nije moguće dohvatiti ID poslodavca");
          return;
        }
        
        const { data, error } = await supabase
          .from("job_listings")
          .select(`
            *,
            applications:applications(*)
          `)
          .eq('employer_id', employerId) // Dodano filtriranje po employer_id
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        
        setJobs(data || []);
        setFilteredJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.locations?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchQuery, jobs]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Poslovi</h1>
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
                  placeholder="Pretraži poslove..." 
                  className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                
                <Button variant="outline" className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sortiraj
                </Button>
                <Link to="/jobs/new">
                  <Button className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Novi posao
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Briefcase className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {searchQuery ? "Nema rezultata pretrage" : "Nema aktivnih poslova"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    {searchQuery 
                      ? `Nije pronađen nijedan posao za "${searchQuery}". Pokušajte s drugom ključnom riječi.` 
                      : "Trenutno nemate aktivnih poslova. Dodajte novi posao za početak."}
                  </p>
                  
                  <Link to="/jobs/new">
                    <Button className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Dodaj novi posao
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <Link to={`/jobs/${job.id}`} key={job.id}>
                      <Card className="overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm h-full transition-all hover:shadow-md hover:translate-y-[-2px]">
                        <div className="p-6">
                          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-2">{job.title}</h3>
                          
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location || "Remote"}</span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                            {job.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-6">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(job.created_at).toLocaleDateString("hr-HR")}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                              <Users className="h-3 w-3" />
                              <span>{job.applications?.length || 0} prijava</span>
                            </div>
                            
                            <div className="ml-auto">
                              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Jobs;
