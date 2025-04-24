import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const verifySession = async () => {
      setIsVerifying(true);
      try {
        // Directly verify with Supabase if there's a valid session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          setIsAuthenticated(false);
          // Immediate redirect on session loss
          navigate("/login", { state: { from: location }, replace: true });
          return;
        }
        
        // Extra validation - verify user exists and token is valid
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          console.error("Auth error:", error?.message);
          setIsAuthenticated(false);
          // Immediate redirect on auth error
          navigate("/login", { state: { from: location }, replace: true });
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Verification error:", error);
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      } finally {
        setIsVerifying(false);
      }
    };
    
    // Run verification immediately
    verifySession();
    
    // Set up periodic verification
    const interval = setInterval(verifySession, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  // Show loading indicator while checking authentication
  if (loading || isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 text-[#43AA8B] animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes if user is authenticated
  return <Outlet />;
};

export default ProtectedRoute;
