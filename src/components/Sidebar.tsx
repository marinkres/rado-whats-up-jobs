import { MessageSquare, Grid, Briefcase, Settings, Menu, LogOut, Mail, ClipboardList, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentEmployerId } from '@/utils/authUtils';

const menuItems = [
  { icon: Grid, label: "Pregled", href: "/overview" },
  { icon: MessageSquare, label: "Razgovori", href: "/chat" },
  { icon: Briefcase, label: "Poslovi", href: "/jobs" },
  { icon: ClipboardList, label: "Prijave", href: "/applications" },
  { icon: Settings, label: "Postavke", href: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("Rado");
  const fetchedRef = useRef(false);
  const { signOut } = useAuth();

  // Get current page title based on route
  useEffect(() => {
    // Set default title based on current path
    const path = location.pathname;
    if (path.includes("/overview")) setPageTitle("Pregled");
    else if (path.includes("/chat")) setPageTitle("Razgovori");
    else if (path.includes("/jobs/new")) setPageTitle("Novi posao");
    else if (path.includes("/jobs") && params.id) setPageTitle("Detalji posla");
    else if (path.includes("/jobs")) setPageTitle("Poslovi");
    else if (path.includes("/applications") && params.id) setPageTitle("Detalji prijave");
    else if (path.includes("/applications")) setPageTitle("Prijave");
    else if (path.includes("/settings")) setPageTitle("Postavke");
    else setPageTitle("Rado");
  }, [location.pathname, params]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchUserDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);

        // Fetch company name from employers table
        const { data: employer, error } = await supabase
          .from("employers")
          .select("id, company_name")
          .eq("email", session.user.email)
          .single();

        if (employer) {
          setCompanyName(employer.company_name);
          console.log("Employer details in sidebar:", employer.company_name, "ID:", employer.id);
        } else {
          console.error("Employer not found:", error?.message);
        }
        
        // Dohvati i provjeravamo employer_id kroz našu utility funkciju
        const employerId = await getCurrentEmployerId();
        console.log("CurrentEmployerId from utility:", employerId);
      }
    };
    fetchUserDetails();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close sidebar when changing routes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default navigation
    await signOut(); // Use the signOut function from AuthContext
  };

  return (
    <>
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/50 z-40 md:hidden">
        <div className="container h-full mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              id="menu-button"
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-3"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            
            <div className="flex items-center">
              <img
                src="/rado.svg"
                alt="Rado Logo"
                className="h-7 block dark:hidden"
              />
              <img
                src="/radow.svg"
                alt="Rado Logo"
                className="h-7 hidden dark:block"
              />
              <div className="ml-3 flex flex-col">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
              </div>
            </div>
          </div>
          
          {/* Replace ThemeSwitch with user name display */}
          <div className="text-right">
            <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {userEmail ? userEmail.split('@')[0] : ''}
            </p>
          </div>
        </div>
      </header>

      {/* Sidebar - handle open state differently on mobile vs desktop */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "fixed top-0 left-0 h-screen w-72 z-50 transform transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800", 
          "border-r border-gray-200 dark:border-gray-700/30",
          // Only apply negative transform on mobile when closed
          "md:translate-x-0 md:z-30",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo section - show X icon to close on mobile - centered logo */}
        <div className="flex justify-between items-center px-4 py-5 border-b border-gray-200 dark:border-gray-700/30">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex items-center justify-center w-full">
            <img
              src="/rado.svg"
              alt="Rado Logo"
              className="h-8 block dark:hidden"
            />
            <img
              src="/radow.svg"
              alt="Rado Logo"
              className="h-8 hidden dark:block"
            />
          </div>
          
          <div className="w-9 md:hidden"></div> {/* Empty div to balance the layout */}
        </div>
        
        {/* Navigation links with improved styling */}
        <nav className="px-4 py-6 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/overview' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                    isActive 
                      ? "bg-[#43AA8B]/10 dark:bg-[#43AA8B]/20 text-[#43AA8B] font-medium shadow-inner" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800/70"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className={cn(
                      "h-5 w-5 mr-3",
                      isActive ? "text-[#43AA8B]" : "text-gray-500 dark:text-gray-400"
                    )} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-[#43AA8B]" />}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* Footer section with company info and actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700/30 space-y-4">
          {/* Theme switch with label - only show on desktop */}
          <div className="hidden md:flex items-center justify-between px-2 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Tema</span>
            <ThemeSwitch />
          </div>
          
          {/* Company info card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-[#43AA8B]">
                {companyName ?? (
                  <span className="animate-pulse text-gray-500 dark:text-gray-400">...</span>
                )}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userEmail ?? (
                  <span className="animate-pulse text-gray-400 dark:text-gray-500">...</span>
                )}
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-medium rounded-lg transition-colors border border-gray-200 dark:border-gray-700/50"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="text-sm">Odjava</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center justify-center gap-2 py-2 px-3 bg-[#43AA8B]/10 hover:bg-[#43AA8B]/20 dark:bg-[#43AA8B]/20 dark:hover:bg-[#43AA8B]/30 text-[#43AA8B] font-medium rounded-lg transition-colors border border-[#43AA8B]/20 dark:border-[#43AA8B]/30"
              onClick={() => window.location.href = 'mailto:support@rado.ai'}
            >
              <Mail size={16} />
              <span className="text-sm">Podrška</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Improved overlay with blur effect for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-gray-500/30 dark:bg-gray-900/70 backdrop-blur-sm z-40 md:hidden transition-all"
        />
      )}
      
      {/* Add a spacer for content to account for the mobile header */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Sidebar;