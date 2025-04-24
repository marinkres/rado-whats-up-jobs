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
import { Mail, Lock, Loader2, AlertCircle, Building, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  name: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Create user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      
      // Generate a UUID for employer ID to ensure we have a stable reference
      const employerId = crypto.randomUUID();
      
      console.log("Kreiranje employer zapisa s ID:", employerId);
      
      // Create employer record in database with explicit ID
      const { error: profileError } = await supabase
        .from("employers")
        .insert({
          id: employerId,
          email: formData.email,
          company_name: formData.companyName,
          contact_name: formData.name,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Greška pri kreiranju poslodavca:", profileError);
        throw profileError;
      }
      
      // Spremi email korisnika u localStorage za praćenje sesija
      localStorage.setItem('currentUserEmail', formData.email);
      localStorage.setItem('currentEmployerId', employerId);
      
      toast({
        title: "Registracija uspješna",
        description: "Vaš račun je kreiran. Dobrodošli u Rado sustav!",
      });
      
      navigate("/overview");
    } catch (error) {
      console.error("Signup error:", error.message);
      setError(error.message || "Došlo je do greške prilikom registracije. Pokušajte ponovno.");
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
              <CardTitle className="text-2xl font-bold text-center text-white">Registracija</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Kreirajte svoj poslodavački račun
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-200">Naziv tvrtke</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Vaša tvrtka d.o.o."
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200">Vaše ime i prezime</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ivan Horvat"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Email adresa</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="vas@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Lozinka</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Minimalno 6 znakova"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-200">Potvrdite lozinku</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Ponovite lozinku"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                      Registracija u tijeku...
                    </>
                  ) : (
                    "Registrirajte se"
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
                Već imate korisnički račun?{" "}
                <Link to="/login" className="font-medium text-[#43AA8B] hover:underline">
                  Prijavite se
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

export default Signup;
