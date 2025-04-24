import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  User,
  Briefcase,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  MapPin,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentEmployerId } from '@/utils/authUtils';
import { toast } from "@/components/ui/use-toast";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  interview: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  interview: <Calendar className="h-4 w-4" />,
};

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        
        // Dohvati ID trenutnog poslodavca
        const employerId = await getCurrentEmployerId();
        
        if (!employerId) {
          console.error("Nije moguće dohvatiti ID poslodavca");
          return;
        }
        
        // Dohvati detalje prijave zajedno s podacima o poslu i kandidatu
        const { data, error } = await supabase
          .from("applications")
          .select(`
            *,
            candidates(*),
            job_listings!inner(*)
          `)
          .eq("id", id)
          .single();
        
        if (error) throw error;
        
        // Provjeri pripada li prijava trenutnom poslodavcu
        if (data.job_listings.employer_id !== employerId) {
          toast({
            title: "Pristup odbijen",
            description: "Nemate ovlaštenje za pregledavanje ove prijave.",
            variant: "destructive",
          });
          navigate('/applications');
          return;
        }
        
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application details:", error.message);
        toast({
          title: "Greška",
          description: "Nije moguće učitati detalje prijave.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationDetails();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state
      setApplication(prev => ({ ...prev, status: newStatus }));
      
    } catch (error) {
      console.error("Error updating application status:", error.message);
    }
  };

  const goBack = () => {
    navigate('/applications');
  };

  // Add function to navigate to chat with this candidate
  const navigateToChat = async () => {
    try {
      if (!application?.candidate_id) return;

      // First check if a conversation already exists
      const { data: existingConversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('candidate_id', application.candidate_id)
        .eq('job_id', application.job_id)
        .maybeSingle();

      if (convError) throw convError;
      
      // If conversation exists, navigate to it
      if (existingConversations?.id) {
        navigate(`/chat?conversation=${existingConversations.id}`);
        return;
      }
      
      // If no conversation exists, create one
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          candidate_id: application.candidate_id,
          job_id: application.job_id,
          phone: application.candidates?.phone || null,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      
      // Navigate to the new conversation
      navigate(`/chat?conversation=${newConversation.id}`);
      
    } catch (error) {
      console.error("Error navigating to chat:", error);
    }
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
            Natrag na prijave
          </Button>
          
          {loading ? (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3 space-y-6">
                  <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <div className="flex items-center gap-4 mb-6">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-5 w-1/4" />
                  </Card>
                </div>
                
                <div className="md:w-1/3 space-y-6">
                  <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="space-y-3">
                      <div className="flex gap-3 items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </Card>
                  
                  <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <>
              {application ? (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main content - left column */}
                  <div className="lg:w-2/3 space-y-6">
                    {/* Application details card */}
                    <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                            Prijava: {application.job_listings?.title || "Nepoznati posao"}
                          </h1>
                          
                          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            <Select 
                              value={application.status} 
                              onValueChange={handleStatusChange}
                            >
                              <SelectTrigger className={cn("w-[150px] border-none", statusColors[application.status])}>
                                <div className="flex items-center gap-2">
                                  {statusIcons[application.status]}
                                  <SelectValue>
                                    {application.status === "pending" && "Čekanje"}
                                    {application.status === "approved" && "Odobreno"}
                                    {application.status === "rejected" && "Odbijeno"}
                                    {application.status === "interview" && "Intervju"}
                                  </SelectValue>
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Čekanje</SelectItem>
                                <SelectItem value="approved">Odobreno</SelectItem>
                                <SelectItem value="rejected">Odbijeno</SelectItem>
                                <SelectItem value="interview">Intervju</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            Prijavljeno: {new Date(application.created_at).toLocaleDateString('hr-HR')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
                          Motivacijsko pismo
                        </h2>
                        
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6 border border-gray-100 dark:border-gray-700/50">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {application.message || "Kandidat nije priložio motivacijsko pismo."}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                          <Button 
                            className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white" 
                            onClick={navigateToChat}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Pošalji poruku
                          </Button>
                          
                          <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Zakaži intervju
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Experience card */}
                    <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          Iskustvo kandidata
                        </h2>
                      </div>
                      
                      <div className="p-6">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          {application.candidates?.experience || "Kandidat nije naveo radno iskustvo."}
                        </p>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Sidebar - right column */}
                  <div className="lg:w-1/3 space-y-6">
                    {/* Candidate info */}
                    <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          O kandidatu
                        </h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#43AA8B]">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">
                              {application.candidates?.name || "Nepoznati kandidat"}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Removed email section as it doesn't exist in the database */}
                          
                          {application.candidates?.phone && (
                            <div className="flex items-center gap-3">
                              <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <a href={`tel:${application.candidates.phone}`} className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
                                {application.candidates.phone}
                              </a>
                            </div>
                          )}
                          
                          {application.candidates?.languages && (
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m5 8 6 6" />
                                  <path d="m4 14 6-6 2-3" />
                                  <path d="M2 5h12" />
                                  <path d="M7 2h1" />
                                  <path d="m22 22-5-10-5 10" />
                                  <path d="M14 18h6" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Jezici:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {application.candidates.languages.split(',').map((language, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {language.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                    
                    {/* Job info */}
                    <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                          O oglasu za posao
                        </h2>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Briefcase className="h-5 w-5 text-[#43AA8B]" />
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {application.job_listings?.title || "Nepoznati posao"}
                          </h3>
                        </div>
                        
                        {/* Location display - updated with null check for job_listings.locations */}
                        {application.job_listings?.locations ? (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{application.job_listings.locations.name}</span>
                          </div>
                        ) : null}
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {application.job_listings?.description || "Nema dostupnog opisa posla."}
                        </p>
                        
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/jobs/${application.job_id}`}>
                            <FileText className="h-4 w-4 mr-2" />
                            Pogledaj cijeli oglas
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
                    <XCircle className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Prijava nije pronađena
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Tražena prijava ne postoji ili je uklonjena.
                  </p>
                  <Button onClick={goBack}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Natrag na prijave
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetail;
