import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Calendar, User, Building, Mail, Phone, Globe, Bell, Shield, Lock, Save, Loader2, MapPin } from "lucide-react";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const Settings = () => {
  const [profile, setProfile] = useState({
    company_name: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    logo_url: "",
    address: ""
  });
  
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    application_alerts: true,
    message_alerts: true,
    marketing_emails: false
  });
  
  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: employer, error } = await supabase
            .from("employers")
            .select("*")
            .eq("email", session.user.email)
            .single();

          if (error) throw error;
          
          if (employer) {
            setProfile({
              company_name: employer.company_name || "",
              email: employer.email || "",
              phone: employer.phone || "",
              website: employer.website || "",
              description: employer.description || "",
              logo_url: employer.logo_url || "",
              address: employer.address || ""
            });
            
            setNotifications({
              email_notifications: employer.email_notifications !== false,
              application_alerts: employer.application_alerts !== false,
              message_alerts: employer.message_alerts !== false,
              marketing_emails: employer.marketing_emails === true
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name, checked) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("employers")
        .update({
          company_name: profile.company_name,
          phone: profile.phone,
          website: profile.website,
          description: profile.description,
          address: profile.address
        })
        .eq("email", profile.email);

      if (error) throw error;
      
      toast({
        title: "Profil ažuriran",
        description: "Vaši podaci su uspješno spremljeni.",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom spremanja podataka.",
        variant: "destructive"
      });
      console.error("Error saving profile:", error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveNotifications = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("employers")
        .update({
          email_notifications: notifications.email_notifications,
          application_alerts: notifications.application_alerts,
          message_alerts: notifications.message_alerts,
          marketing_emails: notifications.marketing_emails
        })
        .eq("email", profile.email);

      if (error) throw error;
      
      toast({
        title: "Postavke obavijesti ažurirane",
        description: "Vaše postavke obavijesti su uspješno spremljene.",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom spremanja postavki obavijesti.",
        variant: "destructive"
      });
      console.error("Error saving notifications:", error.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (security.new_password !== security.confirm_password) {
      toast({
        title: "Greška",
        description: "Nove lozinke se ne podudaraju.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: security.new_password,
      });

      if (error) throw error;
      
      setSecurity({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
      
      toast({
        title: "Lozinka ažurirana",
        description: "Vaša lozinka je uspješno promijenjena.",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom promjene lozinke.",
        variant: "destructive"
      });
      console.error("Error changing password:", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Postavke</h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('hr-HR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-[#43AA8B]/10 data-[state=active]:text-[#43AA8B]"
              >
                <User className="h-4 w-4 mr-2" />
                Profil tvrtke
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-[#43AA8B]/10 data-[state=active]:text-[#43AA8B]"
              >
                <Bell className="h-4 w-4 mr-2" />
                Obavijesti
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-[#43AA8B]/10 data-[state=active]:text-[#43AA8B]"
              >
                <Shield className="h-4 w-4 mr-2" />
                Sigurnost
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <>
                <TabsContent value="profile" className="mt-0">
                  <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Informacije o tvrtki
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Uredite osnovne informacije o vašoj tvrtki
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="company_name">Naziv tvrtke</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="company_name"
                              name="company_name"
                              placeholder="Unesite naziv tvrtke"
                              className="pl-10"
                              value={profile.company_name}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email adresa</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              placeholder="Email adresa"
                              className="pl-10"
                              value={profile.email}
                              disabled
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Email adresu ne možete promijeniti
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Kontakt telefon</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="Kontakt telefon"
                              className="pl-10"
                              value={profile.phone}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website">Web stranica</Label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="website"
                              name="website"
                              placeholder="https://example.com"
                              className="pl-10"
                              value={profile.website}
                              onChange={handleProfileChange}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Adresa</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            name="address"
                            placeholder="Adresa tvrtke"
                            className="pl-10"
                            value={profile.address}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Opis tvrtke</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Unesite kratak opis vaše tvrtke..."
                          rows={5}
                          value={profile.description}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
                      <Button 
                        onClick={saveProfile} 
                        disabled={saving}
                        className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Spremanje...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Spremi promjene
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Postavke obavijesti
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Prilagodite kako i kada primate obavijesti
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email_notifications" className="font-medium text-gray-800 dark:text-gray-100">
                              Email obavijesti
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Primajte sve obavijesti putem emaila
                            </p>
                          </div>
                          <Switch
                            id="email_notifications"
                            checked={notifications.email_notifications}
                            onCheckedChange={(checked) => handleNotificationChange("email_notifications", checked)}
                            className="data-[state=checked]:bg-[#43AA8B]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="application_alerts" className="font-medium text-gray-800 dark:text-gray-100">
                              Obavijesti o prijavama
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Primajte obavijesti o novim prijavama kandidata
                            </p>
                          </div>
                          <Switch
                            id="application_alerts"
                            checked={notifications.application_alerts}
                            onCheckedChange={(checked) => handleNotificationChange("application_alerts", checked)}
                            className="data-[state=checked]:bg-[#43AA8B]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="message_alerts" className="font-medium text-gray-800 dark:text-gray-100">
                              Obavijesti o porukama
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Primajte obavijesti o novim porukama od kandidata
                            </p>
                          </div>
                          <Switch
                            id="message_alerts"
                            checked={notifications.message_alerts}
                            onCheckedChange={(checked) => handleNotificationChange("message_alerts", checked)}
                            className="data-[state=checked]:bg-[#43AA8B]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketing_emails" className="font-medium text-gray-800 dark:text-gray-100">
                              Marketinške poruke
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Primajte novosti i ponude od Rado platforme
                            </p>
                          </div>
                          <Switch
                            id="marketing_emails"
                            checked={notifications.marketing_emails}
                            onCheckedChange={(checked) => handleNotificationChange("marketing_emails", checked)}
                            className="data-[state=checked]:bg-[#43AA8B]"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
                      <Button 
                        onClick={saveNotifications} 
                        disabled={saving}
                        className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Spremanje...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Spremi postavke
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Sigurnosne postavke
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Upravljajte svojim pristupnim podacima
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">Trenutna lozinka</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            id="current_password"
                            name="current_password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={security.current_password}
                            onChange={handleSecurityChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new_password">Nova lozinka</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            id="new_password"
                            name="new_password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={security.new_password}
                            onChange={handleSecurityChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">Potvrdite novu lozinku</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="••••••••"
                            className="pl-10"
                            value={security.confirm_password}
                            onChange={handleSecurityChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
                      <Button 
                        onClick={changePassword} 
                        disabled={saving || !security.current_password || !security.new_password || !security.confirm_password}
                        className="bg-[#43AA8B] hover:bg-[#43AA8B]/90 text-white"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ažuriranje...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Promijeni lozinku
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
