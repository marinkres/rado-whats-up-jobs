import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      const res = await fetch("/api/applications-cache");
      const json = await res.json();
      setApplications(json.data || []);
      setLoading(false);
    };
    fetchApplications();
  }, [page]);

  return (
    <div className="min-h-screen bg-white dark:bg-[hsl(var(--sidebar-background))] transition-colors">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Prijave kandidata</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-5 flex flex-col gap-3 shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full my-2" />
                <Skeleton className="h-3 w-2/3 my-2" />
                <Skeleton className="h-3 w-1/2 my-2" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center text-gray-400 dark:text-gray-500">Nema prijava.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="p-5 flex flex-col gap-3 shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center font-bold text-purple-700 dark:text-purple-200 text-lg">
                    {app.candidates?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">{app.candidates?.name || "Nepoznato ime"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{app.candidates?.phone}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  <div>
                    <span className="font-medium">Jezici:</span>{" "}
                    {app.candidates?.languages || <span className="text-gray-400 dark:text-gray-500">Nije navedeno</span>}
                  </div>
                  <div>
                    <span className="font-medium">Dostupnost:</span>{" "}
                    {app.candidates?.availability || <span className="text-gray-400 dark:text-gray-500">Nije navedeno</span>}
                  </div>
                  <div>
                    <span className="font-medium">Iskustvo:</span>{" "}
                    {app.candidates?.experience || <span className="text-gray-400 dark:text-gray-500">Nije navedeno</span>}
                  </div>
                  <div>
                    <span className="font-medium">Jezik prijave:</span>{" "}
                    {app.candidates?.language_choice === "en"
                      ? "English"
                      : app.candidates?.language_choice === "hr"
                      ? "Hrvatski"
                      : <span className="text-gray-400 dark:text-gray-500">Nije odabrano</span>}
                  </div>
                  {app.job_listings && (
                    <div>
                      <span className="font-medium">Pozicija:</span>{" "}
                      {app.job_listings.title}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Datum prijave:</span>{" "}
                    {new Date(app.created_at).toLocaleString("hr-HR")}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(`tel:${app.candidates?.phone}`)}>
                    Nazovi
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(`https://wa.me/${app.candidates?.phone?.replace("whatsapp:+", "")}`)}>
                    WhatsApp
                  </Button>
                  {/* Dodaj više akcija po potrebi */}
                </div>
              </Card>
            ))}
          </div>
        )}
        {!loading && (
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={() => setPage((p) => p + 1)}
            >
              Učitaj još
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;