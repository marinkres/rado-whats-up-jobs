import { MessageSquare, Grid, Briefcase, Users, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import ThemeSwitch from "./ThemeSwitch";

const menuItems = [
  { icon: Grid, label: "Pregled", href: "/overview" },
  { icon: MessageSquare, label: "Razgovori", href: "/chat" },
  { icon: Briefcase, label: "Poslovi", href: "/jobs" },
  { icon: Users, label: "Prijave", href: "/applications" },
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
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#43AA8B] dark:bg-sidebar-accent rounded-full shadow-lg"
      >
        <Menu className="h-6 w-6 text-white dark:text-sidebar-foreground" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          // Ukloni border u dark modeu
          "fixed top-0 left-0 h-screen w-64 bg-[hsl(var(--sidebar-background))] border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:block"
        )}
      >
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img
              src="/rado.png"
              alt="Rado Logo"
              className="h-28 bg-transparent dark:bg-transparent rounded-lg"
              // logo je već transparentan, ali možeš dodati dark:filter invert ako treba
            />
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                  "bg-transparent dark:bg-transparent",
                  "text-gray-600",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  location.pathname === item.href &&
                    "bg-gray-100  dark:bg-gray-800 text-gray-900"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-200" />
                <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 px-6 space-y-4">
        <ThemeSwitch />
          <div className="bg-gray-300 dark:bg-sidebar-accent/40 rounded-lg p-4 border border-gray-100 dark:border-gray-700 dark:bg-gray-800">   
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-gray-200">
                  {companyName ?? (
                    <span className="animate-pulse text-gray-400 dark:text-sidebar-foreground/40">...</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {userEmail ?? (
                    <span className="animate-pulse text-gray-300 dark:text-sidebar-foreground/30">...</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-2 bg-red-800 dark:bg-destructive text-white font-semibold rounded-lg hover:bg-red-700 dark:hover:bg-destructive/80 transition border border-red-900 dark:border-destructive"
          >
            Odjava
          </button>
          <button
            onClick={() => window.location.href = 'mailto:support@rado.ai'}
            className="w-full py-2 bg-[#43AA8B] dark:bg-sidebar-accent/60 text-white font-semibold rounded-lg hover:bg-green-600 dark:hover:bg-sidebar-accent transition border border-[#43AA8B] dark:border-sidebar-accent"
          >
            Kontaktiraj podršku
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
