import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart, Users, Building2, Calendar } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn"; // Correct path after creating the utility;

const Overview = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to the login page
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
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">Pregled</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-3xl"
                  style={{
                    backgroundColor: "#43AA8B",
                  }}
                >
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ukupno kandidata</p>
                  <p className="text-2xl font-semibold">247</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-3xl"
                  style={{
                    backgroundColor: "#43AA8B",
                  }}
                >
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aktivni poslovi</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-3xl"
                  style={{
                    backgroundColor: "#43AA8B",
                  }}
                >
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stopa zapošljavanja</p>
                  <p className="text-2xl font-semibold">68%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className="p-3 rounded-3xl"
                  style={{
                    backgroundColor: "#43AA8B",
                  }}
                >
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Intervjui ovaj tjedan</p>
                  <p className="text-2xl font-semibold">28</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Nedavne aktivnosti</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm">Marko Horvat je prihvatio ponudu za posao</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <p className="text-sm">Ana Kovačić zakazala intervju</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <p className="text-sm">Ivan Novak poslao prijavu</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Popularni poslovi</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Konobar</p>
                    <p className="text-sm text-gray-500">Split</p>
                  </div>
                  <Button variant="outline" size="sm">42 prijave</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Kuhar</p>
                    <p className="text-sm text-gray-500">Zagreb</p>
                  </div>
                  <Button variant="outline" size="sm">38 prijava</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sobarica</p>
                    <p className="text-sm text-gray-500">Dubrovnik</p>
                  </div>
                  <Button variant="outline" size="sm">27 prijava</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Overview;
