
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const Jobs = () => {
  const jobs = [
    {
      title: "Konobar",
      location: "Split",
      type: "Sezonski",
      applicants: 42,
      posted: "Prije 2 dana"
    },
    {
      title: "Kuhar",
      location: "Zagreb",
      type: "Puno radno vrijeme",
      applicants: 38,
      posted: "Prije 3 dana"
    },
    {
      title: "Sobarica",
      location: "Dubrovnik",
      type: "Sezonski",
      applicants: 27,
      posted: "Prije 5 dana"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-64">
        <div className="container mx-auto py-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Poslovi</h1>
            <Button>+ Novi oglas</Button>
          </div>

          <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Pretraži poslove..." />
              <Input placeholder="Lokacija" />
              <Button className="w-full">Pretraži</Button>
            </div>
          </Card>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.title} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applicants} prijava
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Pogledaj detalje</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Jobs;
