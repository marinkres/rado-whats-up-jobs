import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, Users, ClipboardList } from "lucide-react";

const Overview = () => {
  const [locations, setLocations] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: locationsData } = await supabase.from("locations").select("*");
        setLocations(locationsData || []);

        const { data: jobListingsData } = await supabase.from("job_listings").select("*");
        setJobListings(jobListingsData || []);

        const { data: candidatesData } = await supabase.from("candidates").select("*");
        setCandidates(candidatesData || []);

        const { data: applicationsData } = await supabase.from("applications").select("*");
        setApplications(applicationsData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Pregled</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-600 mt-4">Ukupno lokacija</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{locations.length}</p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-600 mt-4">Ukupno oglasa</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{jobListings.length}</p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-600 mt-4">Ukupno kandidata</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{candidates.length}</p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg flex flex-col items-center text-center">
              <div className="p-4 bg-green-100 rounded-full flex items-center justify-center">
                <ClipboardList className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-600 mt-4">Ukupno prijava</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{applications.length}</p>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Nedavne prijave</h2>
              <ul className="space-y-3">
                {applications.slice(0, 5).map((application) => (
                  <li
                    key={application.id}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">Prijava ID: {application.id}</span>
                    <span className="text-sm font-medium text-gray-500">{application.status}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Popularni poslovi</h2>
              <ul className="space-y-3">
                {jobListings.slice(0, 5).map((job) => {
                  const jobApplications = applications.filter((app) => app.job_id === job.id);
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
        </div>
      </main>
    </div>
  );
};

export default Overview;
