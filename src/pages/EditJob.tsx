import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Calendar,
  ChevronLeft,
  Loader2,
  MapPin,
  Save,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    location: "", // Changed from location_id to location
    description: "",
    requirements: "",
    benefits: "",
  });

  // Load job data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from("job_listings")
          .select("*")
          .eq("id", id)
          .single();
          
        if (jobError) throw jobError;
        
        // Set state - no need to fetch locations anymore
        setFormData({
          title: jobData.title || "",
          location: jobData.location || "", // Changed from location_id to location
          description: jobData.description || "",
          requirements: jobData.requirements || "",
          benefits: jobData.benefits || "",
        });
      } catch (error) {
        console.error("Error fetching job data:", error.message);
        toast({
          title: "Greška",
          description: "Nije moguće učitati podatke o poslu.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from("job_listings")
        .update({
          title: formData.title,
          location: formData.location, // Changed from location_id to location
          description: formData.description,
          requirements: formData.requirements,
          benefits: formData.benefits,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Uspjeh",
        description: "Oglas za posao je uspješno ažuriran.",
      });
      
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error("Error updating job:", error.message);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom ažuriranja oglasa.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Jeste li sigurni da želite izbrisati ovaj oglas za posao?")) {
      return;
    }
    
    try {
      setDeleting(true);
      
      const { error } = await supabase
        .from("job_listings")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      toast({
        title: "Uspjeh",
        description: "Oglas za posao je uspješno izbrisan.",
      });
      
      navigate("/jobs");
    } catch (error) {
      console.error("Error deleting job:", error.message);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom brisanja oglasa.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const goBack = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goBack}
            className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Natrag na detalje posla
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Uredi oglas za posao</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('hr-HR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          {loading ? (
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm p-8 mb-6">
              <div className="flex items-center justify-center h-60">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            </Card>
          ) : (
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden mb-6">
              <form onSubmit={handleSubmit}>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Naslov posla *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="npr. Senior Full Stack Developer"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Lokacija *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="npr. Zagreb, Split, Remote..."
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Opis posla *
                    </label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Unesite opis posla, odgovornosti i očekivanja..."
                      required
                      rows={6}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Zahtjevi
                    </label>
                    <Textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Unesite potrebne kvalifikacije, vještine i iskustvo..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Što nudimo
                    </label>
                    <Textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleChange}
                      placeholder="Unesite benefite, pogodnosti, radne uvjete..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700/50">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting || saving}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Brisanje...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Izbriši oglas
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={goBack}
                    >
                      Odustani
                    </Button>
                    
                    <Button 
                      type="submit"
                      className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Spremanje...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Spremi promjene
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditJob;
