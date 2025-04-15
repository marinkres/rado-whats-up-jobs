
import { MessageSquare, Grid, Briefcase, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const menuItems = [
  { icon: Grid, label: "Pregled", href: "/overview" },
  { icon: MessageSquare, label: "Razgovori", href: "/chat" },
  { icon: Briefcase, label: "Poslovi", href: "/jobs" },
  { icon: Users, label: "Prijave", href: "/applications" },
  { icon: Settings, label: "Postavke", href: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  
  
  return (
    <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Rado</h1>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors",
                location.pathname === item.href && "bg-gray-100 text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <p className="font-medium text-sm">RADO DEMO</p>
              <p className="text-sm text-gray-500">info@rado.ai</p>
            </div>  
          </div>   
        </div>    
      </div>
    </aside>
  );
};

export default Sidebar;
