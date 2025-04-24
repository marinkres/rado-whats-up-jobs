import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Calendar,
  ChevronLeft,
  MapPin,
  Save,
  Briefcase,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, "Naslov mora imati najmanje 5 znakova"),
  location: z.string().min(1, "Lokacija je obavezna"), // Changed from location_id to location
  description: z.string().min(20, "Opis mora imati najmanje 20 znakova"),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
});

const NewJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "", // Changed from location_id to location
      description: "",
      requirements: "",
      benefits: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("job_listings")
        .insert({
          title: data.title,
          location: data.location, // Changed from location_id to location
          description: data.description,
          requirements: data.requirements || null,
          benefits: data.benefits || null,
        });
      
      if (error) throw error;
      
      setSuccess(true);
      
      toast({
        title: "Uspjeh!",
        description: "Novi oglas za posao je uspješno kreiran.",
      });
      
      // After 1.5 seconds, redirect to jobs page
      setTimeout(() => {
        navigate("/jobs");
      }, 1500);
      
    } catch (error) {
      console.error("Error creating job:", error.message);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom kreiranja oglasa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/jobs')}
            className="mb-6 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Natrag na poslove
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Novi oglas za posao</h1>
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
          
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden mb-6">
            {success ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Oglas je uspješno kreiran!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Preusmjeravamo vas na popis poslova...</p>
                <div className="relative w-48 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full animate-[progress_1.5s_ease-in-out]"></div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-800 dark:text-blue-300 rounded-lg mb-2">
                      <Briefcase className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">Ispunite obrazac ispod za objavu novog oglasa za posao.</p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Naslov posla *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="npr. Senior Full Stack Developer"
                              className="bg-white dark:bg-gray-800"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Lokacija *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="npr. Zagreb, Split, Remote..."
                                className="pl-10 bg-white dark:bg-gray-800"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Opis posla *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Unesite opis posla, odgovornosti i očekivanja..."
                              rows={6}
                              className="resize-none bg-white dark:bg-gray-800"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Zahtjevi
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Unesite potrebne kvalifikacije, vještine i iskustvo..."
                              rows={4}
                              className="resize-none bg-white dark:bg-gray-800"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="benefits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">
                            Što nudimo
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Unesite benefite, pogodnosti, radne uvjete..."
                              rows={4}
                              className="resize-none bg-white dark:bg-gray-800"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="flex gap-3">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => navigate('/jobs')}
                      >
                        Odustani
                      </Button>
                      
                      <Button 
                        type="submit"
                        className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Kreiranje...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Objavi oglas
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </Card>
        </div>
      </main>
      <style>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  );
};

export default NewJob;
