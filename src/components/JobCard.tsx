import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, MapPin, Building, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase"; // Add this import

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    employer_id: string;
    location_id?: string;
    created_at: string;
    status: string;
    locations?: {
      name: string;
    };
    employers?: {
      company_name: string;
    };
  };
  showApplyButtons?: boolean;
}

export function JobCard({ job, showApplyButtons = true }: JobCardProps) {
  const [telegramLink, setTelegramLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modified to directly create the link instead of using the API
  useEffect(() => {
    if (showApplyButtons) {
      setIsLoading(true);
      
      // Create Telegram link directly in the component
      const botUsername = "RadoJobsBot"; // Use the known bot username
      const directTelegramLink = `https://t.me/${botUsername}?start=${job.id}`;
      setTelegramLink(directTelegramLink);
      
      console.log("Created Telegram link directly:", directTelegramLink);
      setIsLoading(false);
    }
  }, [job.id, showApplyButtons]);

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formattedDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Card className="h-full flex flex-col backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg md:text-xl font-semibold line-clamp-2">
              {job.title}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Building className="h-3.5 w-3.5" />
              {job.employers?.company_name || "Nepoznata tvrtka"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {job.locations && (
            <Badge variant="outline" className="flex items-center gap-1 bg-transparent">
              <MapPin className="h-3 w-3" />
              {job.locations.name}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1 bg-transparent">
            <CalendarClock className="h-3 w-3" />
            {formattedDate(job.created_at)}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
          {truncateDescription(job.description)}
        </p>
      </CardContent>
      
      {showApplyButtons && (
        <CardFooter className="pt-3 flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-auto" asChild>
            <Link to={`/jobs/${job.id}`}>
              Pogledaj detalje
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              if (telegramLink) {
                // For mobile devices, use telegram:// URI scheme which works better
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                  // Extract the bot username and start parameter
                  const regex = /https:\/\/t\.me\/([^?]+)\?start=(.+)/;
                  const matches = telegramLink.match(regex);
                  if (matches && matches.length >= 3) {
                    const username = matches[1];
                    const startParam = matches[2];
                    window.location.href = `telegram://resolve?domain=${username}&start=${startParam}`;
                    return;
                  }
                }
                // Fallback to standard link for desktop
                window.open(telegramLink, '_blank');
              }
            }}
            disabled={isLoading}
          >
            <svg 
              className="h-4 w-4 text-blue-500" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.198l-1.67 8.03c-.123.595-.45.738-.907.46l-2.507-1.885-1.209 1.188c-.16.158-.297.297-.594.297l.216-2.244 4.082-3.764c.275-.248-.056-.374-.43-.145l-5.035 3.23-2.158-.69c-.594-.197-.608-.596.13-.883l8.413-3.32c.498-.19.931.114.75.826z"/>
            </svg>
            Prijavi se ovdje
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
