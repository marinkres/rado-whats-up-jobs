import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import Chat from "./pages/Chat";
import Jobs from "./pages/Jobs";
import Settings from "./pages/Settings";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; // Import the React-based signup page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login page */}
          <Route path="/overview" element={<Overview />} /> {/* Overview page */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applications" element={<Index />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signup" element={<Signup />} /> {/* Signup page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
