
import Sidebar from "@/components/Sidebar";
import ApplicationsList from "@/components/ApplicationsList";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-64">
        <div className="container mx-auto py-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Prijave</h1>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="flex gap-2 mb-8">
            {["Sve", "Nove", "Kontaktirani", "Intervju", "Zaposleni", "Odbijeni"].map((status) => (
              <Button
                key={status}
                variant="outline"
                className={status === "Sve" ? "bg-gray-100" : ""}
              >
                {status}
              </Button>
            ))}
          </div>

          <ApplicationsList />
        </div>
      </main>
    </div>
  );
};

export default Index;
