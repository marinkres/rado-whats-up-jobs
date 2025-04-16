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
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Prijave</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <Card key={application.id} className="p-6 shadow-lg border border-gray-200 rounded-lg">
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
                <p className="text-sm text-gray-500 mt-2">
                  Poruka: {application.message || "Nema poruke"}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Applications;
