import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "react-hot-toast";

const NewJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data: locationsData, error } = await supabase.from("locations").select("*");
        if (error) throw error;
        setLocations(locationsData || []);
      } catch (error) {
        console.error("Error fetching locations:", error.message);
      }
    };

    fetchLocations();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Input validation
    if (!title || !description || !locationId) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Insert new job into the database
      const { error } = await supabase
        .from("job_listings")
        .insert({ title, description, location_id: locationId });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      toast.success("Posao uspješno dodan!");
      navigate("/jobs"); // Redirect to the jobs page
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const handleCancel = () => {
    navigate("/jobs"); // Navigate back to the jobs page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <Toaster position="top-right" reverseOrder={false} />
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Dodaj novi posao</h1>

          <form onSubmit={handleAddJob} className="space-y-6 max-w-lg bg-white p-6 rounded-lg shadow-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naslov</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
                placeholder="Unesite naslov posla"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
                placeholder="Unesite opis posla"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43AA8B]"
                required
              >
                <option value="" disabled>
                  Odaberite lokaciju
                </option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.city}, {location.country}
                  </option>
                ))}
              </select>
            </div>
            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Dodaj posao
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewJob;
