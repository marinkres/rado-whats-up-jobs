import { MessageSquare, Grid, Briefcase, Users, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

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
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#43AA8B] rounded-full shadow-lg"
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-white border-r z-40 transform transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:block"
        )}
      >
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <img src="/rado.png" alt="Rado Logo" className="h-28" />
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors",
                  location.pathname === item.href && "bg-gray-100 text-gray-900"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-8 left-0 right-0 px-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <div>
                <p className="font-medium text-sm">
                  {companyName ?? <span className="animate-pulse text-gray-400">...</span>}
                </p>
                <p className="text-sm text-gray-500">
                  {userEmail ?? <span className="animate-pulse text-gray-300">...</span>}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-2 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Odjava
          </button>
          <button
            onClick={() => window.location.href = "mailto:support@rado.ai"}
            className="w-full py-2 bg-[#43AA8B] text-white font-semibold rounded-lg hover:bg-green-600 transition"
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
