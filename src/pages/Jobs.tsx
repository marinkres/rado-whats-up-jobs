import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Jobs = () => {
  const [jobListings, setJobListings] = useState([]);
  const [jobToDelete, setJobToDelete] = useState(null); // Track the job to delete
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false); // Track if the description modal is open
  const [descriptionContent, setDescriptionContent] = useState(""); // Track the description content
  const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
  const [editJob, setEditJob] = useState({ id: null, title: "", description: "", status: "active", job_link: "" }); // Track the job being edited
  const [loading, setLoading] = useState(true);
  const [qrModalJob, setQrModalJob] = useState(null); // Track the job for QR modal
  const qrRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Dohvati samo potrebna polja i limitiraj broj rezultata
        const { data: jobsData, error } = await supabase
          .from("job_listings")
          .select("id,title,description,created_at,active,job_link")
          .order("created_at", { ascending: false })
          .limit(50); // ili koliko trebaš prikazati
        if (error) throw error;
        setJobListings(jobsData || []);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      } finally {
        setLoading(false);
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

  const startEditing = (job) => {
    setEditJob({
      id: job.id,
      title: job.title,
      description: job.description,
      status: job.active ? "active" : "paused",
      job_link: job.job_link || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditJob({ id: null, title: "", description: "", status: "active", job_link: "" });
    setIsEditing(false);
  };

  const handleSaveJob = async () => {
    if (!editJob.title) {
      toast.error("Naslov je obavezan!");
      return;
    }

    try {
      if (editJob.id) {
        // Update existing job
        const { error } = await supabase
          .from("job_listings")
          .update({
            title: editJob.title,
            description: editJob.description,
            active: editJob.status === "active",
          })
          .eq("id", editJob.id);
        if (error) throw error;

        setJobListings((prevJobs) =>
          prevJobs.map((job) =>
            job.id === editJob.id
              ? {
                  ...job,
                  title: editJob.title,
                  description: editJob.description,
                  active: editJob.status === "active",
                }
              : job
          )
        );
        toast.success("Posao uspješno ažuriran!");
      } else {
        // Add new job
        const { data, error } = await supabase
          .from("job_listings")
          .insert({
            title: editJob.title,
            description: editJob.description,
            active: editJob.status === "active",
          })
          .select();
        if (error) throw error;

        // Generiraj job_link na temelju novog ID-a
        if (data && data.length > 0) {
          const newJob = data[0];
          const job_link = `https://wa.me/14155238886?text=PRIJAVA:${newJob.id}`;
          // Updajtaj job_link u bazi
          await supabase
            .from("job_listings")
            .update({ job_link })
            .eq("id", newJob.id);

          setJobListings((prevJobs) => [
            ...prevJobs,
            { ...newJob, job_link },
          ]);
        }
        toast.success("Posao uspješno dodan!");
      }

      cancelEditing(); // Exit editing mode
    } catch (error) {
      console.error("Error saving job:", error.message);
      toast.error("Došlo je do pogreške prilikom spremanja posla.");
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

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;
    const canvas = await html2canvas(qrRef.current);
    const link = document.createElement("a");
    link.download = `qr-job-${qrModalJob.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[hsl(var(--sidebar-background))] transition-colors">
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0 dark:text-gray-200">Poslovi</h1>
          <div className="flex justify-between items-center mb-8">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)} // Start adding a new job
                className="px-4 py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Dodaj novi posao
              </button>
            )}
          </div>

          {isEditing && (
            <div className="bg-white p-6 shadow-lg border border-gray-200 rounded-lg mb-8 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                {editJob.id ? "Uredi posao" : "Dodaj novi posao"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Naslov</label>
                  <input
                    type="text"
                    value={editJob.title}
                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Opis</label>
                  <textarea
                    value={editJob.description}
                    onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={editJob.status}
                    onChange={(e) => setEditJob({ ...editJob, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-800"
                  >
                    <option value="active">Aktivan</option>
                    <option value="paused">Pauziran</option>
                  </select>
                </div>
                {editJob.id && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Job link</label>
                    <input
                      type="text"
                      value={
                        (() => {
                          const job = jobListings.find((j) => j.id === editJob.id);
                          return job?.job_link ?? editJob.job_link ?? "";
                        })()
                      }
                      readOnly
                      className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300"
                      placeholder="https://example.com/oglas"
                    />
                  </div>
                )}
                {editJob.id && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Datum objave</label>
                    <input
                      type="text"
                      value={
                        (() => {
                          const job = jobListings.find((j) => j.id === editJob.id);
                          return job?.created_at
                            ? new Date(job.created_at).toLocaleDateString("hr-HR")
                            : "";
                        })()
                      }
                      readOnly
                      className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={cancelEditing} // Cancel editing
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Odustani
                </button>
                <button
                  onClick={handleSaveJob}
                  className="px-4 py-2 bg-[#43AA8B] text-white rounded-lg hover:bg-green-600  transition"
                >
                  Spremi
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-sm">
                  <thead className="bg-gray-100 hidden md:table-header-group">
                    <tr>
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-4 py-2">
                          <Skeleton className="h-4 w-20" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(6)].map((_, i) => (
                      <tr key={i} className="border-b">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-sm dark:bg-gray-900 dark:border-gray-800">
                <thead className="bg-gray-100 hidden md:table-header-group dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-200">Naslov</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-200">Status</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-200">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {jobListings.map((job) => (
                    <tr
                      key={job.id}
                      className="border-t md:table-row flex flex-col md:flex-row md:items-center md:justify-between dark:bg-gray-900"
                    >
                      <td className="px-4 py-2 text-gray-800 md:whitespace-nowrap dark:text-gray-200">
                        <span className="block md:hidden font-medium text-gray-600 dark:text-gray-400">Naslov:</span>
                        {job.title}
                      </td>
                      <td className="px-4 py-2 md:whitespace-nowrap dark:text-gray-200">
                        <span className="block md:hidden font-medium text-gray-600 dark:text-gray-400">Status:</span>
                        <span
                          className={cn(
                            job.active ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                            "font-medium"
                          )}
                        >
                          {job.active ? "Aktivan" : "Neaktivan"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right flex flex-col md:flex-row justify-start gap-2 md:whitespace-nowrap">
                        <button
                          onClick={async () => {
                            const link = `https://wa.me/14155238886?text=PRIJAVA:${job.id}`;
                            await navigator.clipboard.writeText(link);
                            toast.success("WhatsApp link kopiran!");
                          }}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-semibold dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                          disabled={!job.active}
                          style={job.active ? {} : { opacity: 0.5, cursor: "not-allowed" }}
                        >
                          Copy Whatsapp link
                        </button>
                        <button
                          onClick={() => setQrModalJob(job)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                          disabled={!job.active}
                          style={job.active ? {} : { opacity: 0.5, cursor: "not-allowed" }}
                        >
                          QR Code
                        </button>
                        <button
                          onClick={() => startEditing(job)}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                        >
                          Uredi
                        </button>
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                        >
                          Obriši
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* QR Code Modal */}
        {qrModalJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">QR kod za prijavu</h2>
              <div ref={qrRef}>
                <QRCodeSVG value={qrModalJob.job_link} size={192} />
              </div>
              <div className="mt-4 text-center text-xs text-gray-500 break-all">{qrModalJob.job_link}</div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleDownloadQR}
                  className="px-4 py-2 bg-green-300 text-green-900 rounded-lg hover:bg-green-200 transition"
                >
                  Download QR
                </button>
                <button
                  onClick={() => setQrModalJob(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Zatvori
                </button>
              </div>
            </div>
          </div>
        )}

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
