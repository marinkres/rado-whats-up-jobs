
import { MessageSquare, Grid, Briefcase, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: Grid, label: "Pregled", href: "/" },
  { icon: MessageSquare, label: "Razgovori", href: "/chat" },
  { icon: Briefcase, label: "Poslovi", href: "/jobs" },
  { icon: Users, label: "Prijave", href: "/applications" },
  { icon: Settings, label: "Postavke", href: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <SidebarProvider>
      <ShadcnSidebar>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 dark:text-white">Rado</h1>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Izbornik</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.href} 
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                          location.pathname === item.href && "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5 dark:text-gray-400" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </div>
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div>
                <p className="font-medium text-sm dark:text-white">RADO DEMO</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">info@rado.ai</p>
              </div>
            </div>
          </div>
        </div>
      </ShadcnSidebar>
    </SidebarProvider>
  );
};

export default Sidebar;

