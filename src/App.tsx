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
import Signup from "./pages/Signup"; // Import the React-based signup page
import NewJob from "./pages/NewJob"; // Import the NewJob page
import Sidebar from "@/components/Sidebar"; // Import the Sidebar component
import ComingSoon from "./pages/ComingSoon"; // Import the Coming Soon page

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
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
