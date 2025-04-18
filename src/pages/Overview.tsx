import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Users, ClipboardList } from "lucide-react";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Overview = () => {
  const [locations, setLocations] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50">
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0">Pregled</h1>
          {/* Adjusted `mt-16` to ensure more spacing between the burger menu and the title on mobile */}

          {loading ? (
            <>
              {/* Statistika skeleton */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-3 flex flex-col items-center text-center">
                    <Skeleton className="p-2 w-10 h-10 mb-2" />
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-6 w-12" />
                  </Card>
                ))}
              </div>
              {/* Nedavne prijave skeleton */}
              <div className="space-y-8">
                <Card className="p-6">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <ul className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <li key={i} className="flex flex-col bg-gray-100 p-3 rounded-lg">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </li>
                    ))}
                  </ul>
                </Card>
                {/* Popularni poslovi skeleton */}
                <Card className="p-6">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <ul className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <li key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-10" />
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                <Card className="p-3 shadow-md border border-gray-100 rounded-lg flex flex-col items-center text-center bg-gradient-to-r from-green-50 to-white sm:p-4 hover:shadow-lg transition-shadow">
                  <div className="p-2 bg-green-200 rounded-full flex items-center justify-center sm:p-3">
                    <MapPin className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-xs font-medium text-gray-700 mt-1 sm:text-sm sm:mt-2">Ukupno lokacija</h2>
                  <p className="text-lg font-bold text-green-700 mt-1 sm:text-xl">{locations.length}</p>
                </Card>
                <Card className="p-3 shadow-md border border-gray-100 rounded-lg flex flex-col items-center text-center bg-gradient-to-r from-green-50 to-white sm:p-4 hover:shadow-lg transition-shadow">
                  <div className="p-2 bg-green-200 rounded-full flex items-center justify-center sm:p-3">
                    <Briefcase className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-xs font-medium text-gray-700 mt-1 sm:text-sm sm:mt-2">Ukupno oglasa</h2>
                  <p className="text-lg font-bold text-green-700 mt-1 sm:text-xl">{jobListings.length}</p>
                </Card>
                <Card className="p-3 shadow-md border border-gray-100 rounded-lg flex flex-col items-center text-center bg-gradient-to-r from-green-50 to-white sm:p-4 hover:shadow-lg transition-shadow">
                  <div className="p-2 bg-green-200 rounded-full flex items-center justify-center sm:p-3">
                    <Users className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-xs font-medium text-gray-700 mt-1 sm:text-sm sm:mt-2">Ukupno kandidata</h2>
                  <p className="text-lg font-bold text-green-700 mt-1 sm:text-xl">{candidates.length}</p>
                </Card>
                <Card className="p-3 shadow-md border border-gray-100 rounded-lg flex flex-col items-center text-center bg-gradient-to-r from-green-50 to-white sm:p-4 hover:shadow-lg transition-shadow">
                  <div className="p-2 bg-green-200 rounded-full flex items-center justify-center sm:p-3">
                    <ClipboardList className="h-5 w-5 text-green-700 sm:h-6 sm:w-6" />
                  </div>
                  <h2 className="text-xs font-medium text-gray-700 mt-1 sm:text-sm sm:mt-2">Ukupno prijava</h2>
                  <p className="text-lg font-bold text-green-700 mt-1 sm:text-xl">{applications.length}</p>
                </Card>
              </div>

              <div className="space-y-8">
                <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Nedavne prijave</h2>
                  <ul className="space-y-3">
                    {applications.slice(0, 5).map((application) => (
                      <li
                        key={application.id}
                        className="flex flex-col bg-gray-100 p-3 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          Kandidat: {application.candidates?.name || "Nepoznati kandidat"}
                        </span>
                        <span className="text-sm text-gray-700">
                          Posao: {application.job_listings?.title || "Nepoznati posao"}
                        </span>
                        <span className="text-sm text-gray-600">
                          Datum: {new Date(application.created_at).toLocaleDateString("hr-HR")}
                        </span>
                        <span className="text-sm text-gray-500">
                          Status:{" "}
                          <span
                            className={cn(
                              application.status === "approved"
                                ? "text-green-600"
                                : application.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600",
                              "font-medium"
                            )}
                          >
                            {application.status}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Popularni poslovi</h2>
                  <ul className="space-y-3">
                    {jobListings.slice(0, 5).map((job) => {
                      const jobApplications = applications.filter((app) => app.job_id === job.id); // Match `job_id` with `job.id`
                      return (
                        <li
                          key={job.id}
                          className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">{job.title}</span>
                          <span className="text-sm font-medium text-gray-500">
                            {jobApplications.length} prijava
                          </span>
                        </li>
                      );
                    })}
                  </ul>
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
