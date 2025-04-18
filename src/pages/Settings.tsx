import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react"; // Import WhatsApp-like icon

const Settings = () => {
  const [userEmail, setUserEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);

        // Fetch employer details
        const { data: employer, error } = await supabase
          .from("employers")
          .select("company_name, phone")
          .eq("email", session.user.email)
          .single();

        if (!error && employer) {
          setCompanyName(employer.company_name);
          setPhone(employer.phone);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 mt-16 sm:mt-0">Postavke</h1>
          {/* Adjusted `mt-16` to ensure more spacing between the burger menu and the title on mobile */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profil tvrtke</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">Naziv tvrtke</label>
                  <Input value={companyName} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input value={userEmail} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <Input value={phone} readOnly />
                </div>
                <Button>Spremi promjene</Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-lg font-semibold">WhatsApp integracija</h2>
              </div>
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Povezano</p>
                    <p className="text-sm text-green-600">+385 98 765 4321</p>
                  </div>
                  <Button variant="outline">Promijeni broj</Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Obavijesti</h2>
              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email obavijesti</p>
                    <p className="text-sm text-gray-500">Primajte obavijesti o novim prijavama</p>
                  </div>
                  <Button variant="outline">Isključeno</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WhatsApp obavijesti</p>
                    <p className="text-sm text-gray-500">Primajte obavijesti putem WhatsAppa</p>
                  </div>
                  <Button variant="outline">Uključeno</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
