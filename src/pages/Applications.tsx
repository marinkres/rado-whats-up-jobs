import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      // Pretpostavljamo da tablica conversations ima candidate_id i job_id
      // i da postoji veza na candidates i (opcionalno) job_listings
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          candidate_id,
          job_id,
          candidates (
            id,
            name,
            phone,
            languages,
            availability,
            experience,
            language_choice
          ),
          job_listings (
            id,
            title
          )
        `)
        .order("created_at", { ascending: false });
      if (!error && data) setApplications(data);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-6">Prijave kandidata</h1>
        {loading ? (
          <div className="text-center text-gray-500">Učitavanje...</div>
        ) : applications.length === 0 ? (
          <div className="text-center text-gray-400">Nema prijava.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="p-5 flex flex-col gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-lg">
                    {app.candidates?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{app.candidates?.name || "Nepoznato ime"}</div>
                    <div className="text-sm text-gray-500">{app.candidates?.phone}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <div>
                    <span className="font-medium">Jezici:</span>{" "}
                    {app.candidates?.languages || <span className="text-gray-400">Nije navedeno</span>}
                  </div>
                  <div>
                    <span className="font-medium">Dostupnost:</span>{" "}
                    {app.candidates?.availability || <span className="text-gray-400">Nije navedeno</span>}
                  </div>
                  <div>
                    <span className="font-medium">Iskustvo:</span>{" "}
                    {app.candidates?.experience || <span className="text-gray-400">Nije navedeno</span>}
                  </div>
                  <div>
                    <span className="font-medium">Jezik prijave:</span>{" "}
                    {app.candidates?.language_choice === "en"
                      ? "English"
                      : app.candidates?.language_choice === "hr"
                      ? "Hrvatski"
                      : <span className="text-gray-400">Nije odabrano</span>}
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
      </div>
    </div>
  );
};

export default Applications;