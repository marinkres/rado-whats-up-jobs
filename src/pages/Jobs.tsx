import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Jobs = () => {
  const [jobListings, setJobListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: jobsData, error } = await supabase.from("job_listings").select("*");
        if (error) throw error;
        setJobListings(jobsData || []);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovaj posao?")) return;

    try {
      const { error } = await supabase.from("job_listings").delete().eq("id", jobId);
      if (error) throw error;

      // Remove the deleted job from the state
      setJobListings((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      alert("Posao uspješno obrisan!");
    } catch (error) {
      console.error("Error deleting job:", error.message);
      alert("Došlo je do pogreške prilikom brisanja posla.");
    }
  };

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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Poslovi</h1>
            <button
              onClick={() => navigate("/jobs/new")}
              className="px-4 py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Dodaj novi posao
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListings.map((job) => (
              <Card key={job.id} className="p-6 shadow-lg border border-gray-200 rounded-lg relative">
                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                <p className="text-sm text-gray-600 mt-2">{job.description || "Nema opisa"}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Status:{" "}
                  <span
                    className={cn(
                      job.active ? "text-green-600" : "text-red-600",
                      "font-medium"
                    )}
                  >
                    {job.active ? "Aktivan" : "Neaktivan"}
                  </span>
                </p>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
