import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import NotFound from "./pages/NotFound";
import Overview from "./pages/Overview";
import Chat from "./pages/Chat";
import Jobs from "./pages/Jobs";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; 
import NewJob from "./pages/NewJob"; 
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import JobDetail from "./pages/JobDetail";
import EditJob from "./pages/EditJob";
import Sidebar from "@/components/Sidebar"; 
import ComingSoon from "./pages/ComingSoon";
import Pricing from "./pages/Pricing"; // Import the Pricing component
import Careers from "./pages/Careers"; 
import TelegramDebug from "./pages/TelegramDebug"; // Import the TelegramDebug component
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Root redirect component to handle authentication state
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 text-[#43AA8B] animate-spin" />
      </div>
    );
  }
  
  // If logged in, redirect to overview, otherwise show landing page
  if (user) {
    return <Navigate to="/overview" replace />;
  }
  
  return <ComingSoon />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={
              <>
                <Login />
                <Toaster />
                <Sonner />
              </>
            } />
            <Route path="/signup" element={
              <>
                <Signup />
                <Toaster />
                <Sonner />
              </>
            } />
            {/* Add Pricing route here - similar to login/signup */}
            <Route path="/pricing" element={
              <>
                <Pricing />
                <Toaster />
                <Sonner />
              </>
            } />
            {/* Add Pricing route here - similar to login/signup */}
            <Route path="/careers" element={
              <>
                <Careers />
                <Toaster />
                <Sonner />
              </>
            } />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Layout with Sidebar */}
              <Route element={
                <>
                  <Sidebar />
                  <Outlet />
                  <Toaster />
                  <Sonner />
                </>
              }>
                <Route path="/overview" element={<Overview />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/new" element={<NewJob />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/jobs/:id/edit" element={<EditJob />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/:id" element={<ApplicationDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/telegram-debug" element={<TelegramDebug />} />
              </Route>
            </Route>

            {/* 404 route */}
            <Route path="*" element={
              <>
                <NotFound />
                <Toaster />
                <Sonner />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
