import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data: applicationsData, error } = await supabase.from("applications").select(`
          id,
          status,
          message,
          created_at,
          job_listings (title),
          candidates (name)
        `);
        if (error) throw error;
        setApplications(applicationsData || []);
      } catch (error) {
        console.error("Error fetching applications:", error.message);
      }
    };

    fetchApplications();
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0">Prijave</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="p-6 shadow-lg border border-gray-200 rounded-lg flex flex-col h-full">
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {application.job_listings?.title || "Nepoznati posao"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    Kandidat:{" "}
                    <span className="font-medium text-gray-800">
                      {application.candidates?.name || "Nepoznati kandidat"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Poruka: {application.message || "Nema poruke"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Datum: {new Date(application.created_at).toLocaleDateString("hr-HR")}
                  </p>
                </div>
                <div className="mt-auto sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                  {/* Added `sticky bottom-0` to ensure the status is always at the bottom */}
                  <p className="text-sm text-gray-500">
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
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Applications;
