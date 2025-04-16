import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const Jobs = () => {
  const [jobListings, setJobListings] = useState([]);
  const [jobToDelete, setJobToDelete] = useState(null); // Track the job to delete
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

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const { error } = await supabase.from("job_listings").delete().eq("id", jobToDelete.id);
      if (error) throw error;

      // Remove the deleted job from the state
      setJobListings((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete.id));
      toast.success("Posao uspješno obrisan!");
      setJobToDelete(null); // Close the modal
    } catch (error) {
      console.error("Error deleting job:", error.message);
      toast.error("Došlo je do pogreške prilikom brisanja posla.");
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
        <Toaster position="top-right" reverseOrder={false} />
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
                  onClick={() => setJobToDelete(job)} // Open the modal
                  className="absolute top-4 right-4 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {jobToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Potvrda brisanja</h2>
              <p className="text-sm text-gray-600 mb-6">
                Jeste li sigurni da želite obrisati posao <strong>{jobToDelete.title}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setJobToDelete(null)} // Close the modal
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Odustani
                </button>
                <button
                  onClick={handleDeleteJob}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
