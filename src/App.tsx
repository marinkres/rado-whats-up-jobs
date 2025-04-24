import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import Chat from "./pages/Chat";
import Jobs from "./pages/Jobs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import NewJob from "./pages/NewJob"; 
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail"; // New import
import JobDetail from "./pages/JobDetail"; // Add this import
import EditJob from "./pages/EditJob"; // Add this import
import Sidebar from "@/components/Sidebar"; 
import ComingSoon from "./pages/ComingSoon"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ComingSoon />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Sve ostale rute wrapaj sa Sidebar */}
          <Route
            element={
              <>
                <Sidebar />
                <Outlet />
              </>
            }
          >
            <Route path="/overview" element={<Overview />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<NewJob />} />
            <Route path="/jobs/:id" element={<JobDetail />} /> {/* Add this new route */}
            <Route path="/jobs/:id/edit" element={<EditJob />} /> {/* Add this new route */}
            <Route path="/applications" element={<Applications />} />
            <Route path="/applications/:id" element={<ApplicationDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
