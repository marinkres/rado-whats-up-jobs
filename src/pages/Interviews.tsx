import React from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";

const Interviews = () => {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0">Razgovori</h1>
          {/* Adjusted `mt-16` to ensure more spacing between the burger menu and the title on mobile */}
        </div>
      </main>
    </div>
  );
};

export default Interviews;