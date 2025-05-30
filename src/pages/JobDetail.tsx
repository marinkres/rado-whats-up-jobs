import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronLeft,
  Briefcase,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Share2,
  ClipboardList,
  Copy,
  QrCode,
  Check,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { toast } from "@/components/ui/use-toast";
import { getCurrentEmployerId } from '@/utils/authUtils';

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showQRCode, setShowQRCode] = useState(false);
  const [copying, setCopying] = useState(false);
  const [telegramLink, setTelegramLink] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        
        // Dohvati ID trenutnog poslodavca
        const employerId = await getCurrentEmployerId();
        
        if (!employerId) {
          console.error("Nije moguće dohvatiti ID poslodavca");
          return;
        }
        
        // Dohvati podatke o poslu
        const { data: jobData, error: jobError } = await supabase
          .from("job_listings")
          .select("*")
          .eq("id", id)
          .single();
        
        if (jobError) throw jobError;
        
        // Provjeri pripada li posao trenutnom poslodavcu
        if (jobData.employer_id !== employerId) {
          toast({
            title: "Pristup odbijen",
            description: "Nemate ovlaštenje za pregledavanje ovog posla.",
            variant: "destructive",
          });
          navigate('/jobs');
          return;
        }
        
        setJob(jobData);
        
        // Dohvati prijave za ovaj posao
        const { data: appData, error: appError } = await supabase
          .from("applications")
          .select(`
            *,
            candidates(*)
          `)
          .eq("job_id", id)
          .order("created_at", { ascending: false });
        
        if (appError) throw appError;
        
        setApplications(appData || []);
      } catch (error) {
        console.error("Error fetching job details:", error.message);
        toast({
          title: "Greška",
          description: "Nije moguće učitati detalje posla.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, navigate]);

  // Modified Telegram link generation - use direct link construction instead of API
  useEffect(() => {
    if (job?.id) {
      // Create Telegram link directly in the component
      const botUsername = "RadoJobsBot"; // Use the known bot username
      const directTelegramLink = `https://t.me/${botUsername}?start=${job.id}`;
      setTelegramLink(directTelegramLink);
      
      console.log("Created Telegram link directly:", directTelegramLink);
      
      // Skip the API call for now since it's not working in development
      /*
      fetch(`/api/telegram-deeplink?job_id=${job.id}`)
        .then(async response => {
          // ...existing code...
        })
        .catch(error => {
          console.error("Failed to get Telegram link:", error);
          // Set a fallback link
          const botUsername = "RadoJobsBot"; // Fallback username
          setTelegramLink(`https://t.me/${botUsername}?start=${job.id}`);
        });
      */
    }
  }, [job]);

  const goBack = () => {
    navigate('/jobs');
  };

  const navigateToEditJob = () => {
    navigate(`/jobs/${id}/edit`);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d. MMMM yyyy.", { locale: hr });
    } catch {
      return dateString;
    }
  };

  // Generate WhatsApp share link
  const getWhatsAppLink = () => {
    const baseUrl = "https://radojobs.eu/jobs";
    const jobUrl = `${baseUrl}/${id}`;
    const text = `Započni prijavu na posao: ${job?.title} - ${jobUrl}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  // Copy share link to clipboard
  const copyShareLink = () => {
    const baseUrl = "https://rado.ai/jobs";
    const jobUrl = `${baseUrl}/${id}`;
    
    setCopying(true);
    navigator.clipboard.writeText(jobUrl)
      .then(() => {
        toast({
          title: "Link kopiran",
          description: "Link na oglas je kopiran u međuspremnik."
        });
        setTimeout(() => setCopying(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setCopying(false);
      });
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
            Natrag na poslove
          </Button>
          
          {loading ? (
            <div className="space-y-8">
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm p-6">
                <Skeleton className="h-8 w-2/3 mb-4" />
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-5 w-1/4" />
              </Card>
            </div>
          ) : (
            <>
              {job ? (
                <div className="space-y-6">
                  {/* Job Header Card */}
                  <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            {job.title}
                          </h1>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {job.location && (
                              <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                                <MapPin className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                <span>{job.location}</span> {/* Changed from job.locations.name to job.location */}
                              </Badge>
                            )}
                            
                            <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                              <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                              <span>Objavljeno {formatDate(job.created_at)}</span>
                            </Badge>
                            
                            <Badge variant="outline" className="flex items-center gap-1 py-1 px-2">
                              <Users className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                              <span>{applications.length} prijava</span>
                            </Badge>
                          </div>

                          {/* Dates section - new addition */}
                          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <CalendarDays className="h-3.5 w-3.5 mr-1" />
                              <span>Kreirano: {formatDate(job.created_at)}</span>
                            </div>
                            {job.updated_at && job.updated_at !== job.created_at && (
                              <div className="flex items-center">
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                <span>Ažurirano: {formatDate(job.updated_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action buttons - fixed for mobile */}
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-200 dark:border-gray-700"
                            onClick={navigateToEditJob}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            <span className="md:inline">Uredi</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-200 dark:border-gray-700"
                            onClick={copyShareLink}
                          >
                            {copying ? (
                              <Check className="h-4 w-4 mr-1 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 mr-1" />
                            )}
                            <span className="md:inline">Kopiraj</span>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-200 dark:border-gray-700"
                            onClick={() => setShowQRCode(true)}
                          >
                            <QrCode className="h-4 w-4 mr-1" />
                            <span className="md:inline">QR kod</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 bg-green-600 hover:bg-green-700 hover:text-white text-white dark:border-gray-700"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(getWhatsAppLink(), '_blank');
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            <span className="md:inline">WhatsApp</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 bg-blue-500 hover:bg-blue-600 hover:text-white text-white dark:border-gray-700"
                            onClick={(e) => {
                              e.preventDefault();
                              if (telegramLink) {
                                window.open(telegramLink, '_blank');
                              }
                            }}
                          >
                            <svg 
                              className="h-4 w-4 mr-1" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.198l-1.67 8.03c-.123.595-.45.738-.907.46l-2.507-1.885-1.209 1.188c-.16.158-.297.297-.594.297l.216-2.244 4.082-3.764c.275-.248-.056-.374-.43-.145l-5.035 3.23-2.158-.69c-.594-.197-.608-.596.13-.883l8.413-3.32c.498-.19.931.114.75.826z"/>
                            </svg>
                            <span className="md:inline">Telegram</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Tabbed Content */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg">
                      <TabsTrigger 
                        value="details" 
                        className="data-[state=active]:bg-[#43AA8B]/10 data-[state=active]:text-[#43AA8B]"
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Detalji o poslu
                      </TabsTrigger>
                      <TabsTrigger 
                        value="applications" 
                        className="data-[state=active]:bg-[#43AA8B]/10 data-[state=active]:text-[#43AA8B]"
                      >
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Prijave ({applications.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Job Details Tab */}
                    <TabsContent value="details" className="mt-0">
                      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm p-6">
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                            Opis posla
                          </h2>
                          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {job.description || "Nema dostupnog opisa posla."}
                          </div>
                          
                          {job.requirements && (
                            <>
                              <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100">
                                Zahtjevi
                              </h3>
                              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {job.requirements}
                              </div>
                            </>
                          )}
                          
                          {job.benefits && (
                            <>
                              <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100">
                                Što nudimo
                              </h3>
                              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {job.benefits}
                              </div>
                            </>
                          )}
                        </div>
                      </Card>
                    </TabsContent>
                    
                    {/* Applications Tab */}
                    <TabsContent value="applications" className="mt-0">
                      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            Prijave kandidata
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Ukupno {applications.length} prijava za ovaj posao
                          </p>
                        </div>
                        
                        {applications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-3">
                              <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">Nema prijava za ovaj posao</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                            {applications.map((application) => (
                              <div 
                                key={application.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                onClick={() => navigate(`/applications/${application.id}`)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#43AA8B]">
                                    <Users className="h-5 w-5" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                                        {application.candidates?.name || "Nepoznati kandidat"}
                                      </h3>
                                      <Badge 
                                        className={cn(
                                          "text-xs",
                                          application.status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                                          application.status === "approved" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                                          application.status === "rejected" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                                          application.status === "interview" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                                        )}
                                      >
                                        {application.status === "pending" && "Čekanje"}
                                        {application.status === "approved" && "Odobreno"}
                                        {application.status === "rejected" && "Odbijeno"}
                                        {application.status === "interview" && "Intervju"}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {application.candidates?.phone || "Bez kontakta"}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(application.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mb-4">
                    <Briefcase className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Posao nije pronađen
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    Traženi posao ne postoji ili je uklonjen.
                  </p>
                  <Button onClick={goBack}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Natrag na poslove
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR kod za dijeljenje oglasa</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={`https://rado.ai/jobs/${id}`}
                viewBox={`0 0 256 256`}
              />
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              Skenirajte QR kod kako biste podijelili ovaj oglas za posao
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDetail;