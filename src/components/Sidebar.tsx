import { MessageSquare, Grid, Briefcase, Settings, Menu, LogOut, Mail, ClipboardList } from "lucide-react";"lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import ThemeSwitch from "./ThemeSwitch";

const menuItems = [
  { icon: Grid, label: "Pregled", href: "/overview" },
  { icon: MessageSquare, label: "Razgovori", href: "/chat" },
  { icon: Briefcase, label: "Poslovi", href: "/jobs" },
  { icon: ClipboardList, label: "Prijave", href: "/applications" }, // Added Applications link
  { icon: Settings, label: "Postavke", href: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const fetchedRef = useRef(false);

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
          .select("company_name")
          .eq("email", session.user.email)
          .single();

        if (!error && employer) {
          setCompanyName(employer.company_name);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button - now with a nicer style */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-6 left-6 z-50 p-2 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-white"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar - complete redesign with light/dark mode */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-72 z-40 transform transition-all duration-300 ease-in-out shadow-xl",
          "bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800", 
          "border-r border-gray-200 dark:border-gray-700/30",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:block"
        )}
      >
        {/* Logo section */}
        <div className="flex flex-col h-full">
          <div className="flex justify-center py-8 border-b border-gray-200 dark:border-gray-700/30">
            <img
              src="/rado.svg"
              alt="Rado Logo"
              className="h-10 block dark:hidden"
            />
            <img
              src="/radow.svg"
              alt="Rado Logo"
              className="h-10 hidden dark:block"
            />
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
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive 
                        ? "bg-[#43AA8B]/10 dark:bg-[#43AA8B]/20 text-[#43AA8B] font-medium shadow-inner" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-800/70"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-[#43AA8B]" : "text-gray-500 dark:text-gray-400"
                    )} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* Footer section with company info and actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700/30 space-y-4">
            {/* Theme switch with label */}
            <div className="flex items-center justify-between px-2 py-2">
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
              <button
                onClick={() => window.location.href = "/"}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-medium rounded-lg transition-colors border border-gray-200 dark:border-gray-700/50"
              >
                <LogOut size={16} />
                <span className="text-sm">Odjava</span>
              </button>
              <button
                onClick={() => window.location.href = 'mailto:support@rado.ai'}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#43AA8B]/10 hover:bg-[#43AA8B]/20 dark:bg-[#43AA8B]/20 dark:hover:bg-[#43AA8B]/30 text-[#43AA8B] font-medium rounded-lg transition-colors border border-[#43AA8B]/20 dark:border-[#43AA8B]/30"
              >
                <Mail size={16} />
                <span className="text-sm">Podrška</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Improved overlay with blur effect for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-gray-500/30 dark:bg-gray-900/70 backdrop-blur-sm z-30 md:hidden transition-all"
        />
      )}
    </>
  );
};

export default Sidebar;