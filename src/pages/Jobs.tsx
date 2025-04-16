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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Track if the edit modal is open
  const [editJob, setEditJob] = useState({ id: null, title: "", description: "" }); // Track the job being edited
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false); // Track if the description modal is open
  const [descriptionContent, setDescriptionContent] = useState(""); // Track the description content
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

  const openEditModal = (job) => {
    setEditJob({ id: job.id, title: job.title, description: job.description });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditJob({ id: null, title: "", description: "" });
    setIsEditModalOpen(false);
  };

  const handleEditJob = async () => {
    if (!editJob.id) return;

    try {
      const { error } = await supabase
        .from("job_listings")
        .update({ title: editJob.title, description: editJob.description })
        .eq("id", editJob.id);
      if (error) throw error;

      // Update the job in the state
      setJobListings((prevJobs) =>
        prevJobs.map((job) =>
          job.id === editJob.id ? { ...job, title: editJob.title, description: editJob.description } : job
        )
      );
      toast.success("Posao uspješno ažuriran!");
      closeEditModal(); // Close the modal
    } catch (error) {
      console.error("Error updating job:", error.message);
      toast.error("Došlo je do pogreške prilikom ažuriranja posla.");
    }
  };

  const openDescriptionModal = (description) => {
    setDescriptionContent(description || "Nema opisa");
    setIsDescriptionModalOpen(true);
  };

  const closeDescriptionModal = () => {
    setDescriptionContent("");
    setIsDescriptionModalOpen(false);
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0">Poslovi</h1>
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate("/jobs/new")}
              className="px-4 py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
            >
              Dodaj novi posao
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Naslov</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Opis</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Datum kreiranja</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {jobListings.map((job) => (
                  <tr key={job.id} className="border-t">
                    <td className="px-6 py-4 text-sm text-gray-800">{job.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => openDescriptionModal(job.description)} // Open the description modal
                        className="text-blue-600 hover:underline"
                      >
                        Opis
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={cn(
                          job.active ? "text-green-600" : "text-red-600",
                          "font-medium"
                        )}
                      >
                        {job.active ? "Aktivan" : "Neaktivan"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleDateString("hr-HR")}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(job)} // Open the edit modal
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-.828.536l-3 1a1 1 0 01-1.264-1.264l1-3a2 2 0 01.536-.828z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setJobToDelete(job)} // Open the delete modal
                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* Edit Job Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Uredi posao</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Naslov</label>
                  <input
                    type="text"
                    value={editJob.title}
                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opis</label>
                  <textarea
                    value={editJob.description}
                    onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={closeEditModal} // Close the modal
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Odustani
                </button>
                <button
                  onClick={handleEditJob}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Spremi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description Modal */}
        {isDescriptionModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Opis posla</h2>
              <p className="text-sm text-gray-600">{descriptionContent}</p>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={closeDescriptionModal} // Close the modal
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Zatvori
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
