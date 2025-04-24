import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      navigate("/overview");
      toast({
        title: "Prijava uspješna",
        description: "Dobrodošli natrag u Rado sustav.",
      });
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Neuspješna prijava. Provjerite email i lozinku.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="container py-6">
        {/* Empty header to maintain spacing */}
      </header>
      
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <img 
            src="/radow.svg" 
            alt="Rado Logo" 
            className="h-12 md:h-16 mb-8" 
          />
          
          <Card className="backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 shadow-xl w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">Prijava</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Unesite svoje podatke za pristup sustavu
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vas@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-200">Lozinka</Label>
                    <Link to="/login" className="text-xs text-[#43AA8B] hover:underline">
                      Zaboravljena lozinka?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Prijava u tijeku...
                    </>
                  ) : (
                    "Prijavi se"
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">
                    ili
                  </span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                Kontaktiraj{" "}
                <Link to="/login" className="font-medium text-[#43AA8B] hover:underline">
                  Podršku
                </Link>
              </div>
            </CardFooter>
          </Card>
          
          <p className="text-center mt-6 text-sm text-gray-400">
            © {new Date().getFullYear()} Rado, Inc. Sva prava pridržana.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
