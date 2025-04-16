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
        const { data: applicationsData } = await supabase.from("applications").select("*");
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0">Prijave</h1>
          {/* Adjusted `mt-16` to ensure more spacing between the burger menu and the title on mobile */}
          <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sve prijave</h2>
            <ul className="space-y-3">
              {applications.map((application) => (
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
        </div>
      </main>
    </div>
  );
};

export default Applications;