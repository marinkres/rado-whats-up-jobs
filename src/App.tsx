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
import ApplicationDetail from "./pages/ApplicationDetail";
import JobDetail from "./pages/JobDetail";
import EditJob from "./pages/EditJob";
import Sidebar from "@/components/Sidebar"; 
import ComingSoon from "./pages/ComingSoon";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<ComingSoon />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

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
              </Route>
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
