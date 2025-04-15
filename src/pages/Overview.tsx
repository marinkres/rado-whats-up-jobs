import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart, Users, Building2, Calendar } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-64">
        <div className="container mx-auto py-8 px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Pregled</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Log Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ukupno kandidata</p>
                  <p className="text-2xl font-semibold">247</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Aktivni poslovi</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BarChart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stopa zapošljavanja</p>
                  <p className="text-2xl font-semibold">68%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
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
