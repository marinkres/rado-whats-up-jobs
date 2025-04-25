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
import { Calendar, User, Building, Mail, Phone, Globe, Bell, Shield, Lock, Save, Loader2, MapPin, Copy } from "lucide-react";

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

  const [integrations, setIntegrations] = useState({
    whatsapp_enabled: true,
    telegram_enabled: false,
    telegram_bot_username: "",
    webhook_url: ""
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
            
            setIntegrations({
              whatsapp_enabled: employer.whatsapp_enabled !== false,
              telegram_enabled: employer.telegram_enabled === true,
              telegram_bot_username: employer.telegram_bot_username || "",
              webhook_url: window.location.origin + "/api/telegram-webhook"
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

  const handleIntegrationsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIntegrations(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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

  const saveIntegrations = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("employers")
        .update({
          whatsapp_enabled: integrations.whatsapp_enabled,
          telegram_enabled: integrations.telegram_enabled,
          telegram_bot_username: integrations.telegram_bot_username,
        })
        .eq("email", profile.email);

      if (error) throw error;
      
      toast({
        title: "Integracije ažurirane",
        description: "Vaše postavke integracija su uspješno spremljene.",
      });
    } catch (error) {
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom spremanja postavki integracija.",
        variant: "destructive"
      });
      console.error("Error saving integrations:", error.message);
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

  const enableTelegram = async () => {
    try {
      setSaving(true);
      // Get the current user's email instead of user ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) throw new Error("User not authenticated");
      
      // Get employer ID using email - this matches how you fetch the profile
      const { data: employer, error } = await supabase
        .from("employers")
        .select("id")
        .eq("email", session.user.email)
        .single();
        
      if (error || !employer?.id) {
        console.error("Error finding employer:", error);
        throw new Error("Employer not found");
      }
      
      console.log("Found employer ID:", employer.id);
      
      // Update the employer record directly
      const { error: updateError } = await supabase
        .from("employers")
        .update({ 
          telegram_enabled: true,
          telegram_bot_username: "Radojobs_bot" 
        })
        .eq("id", employer.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setIntegrations(prev => ({
        ...prev,
        telegram_enabled: true,
        telegram_bot_username: "Radojobs_bot"
      }));
      
      toast({
        title: "Telegram integracija omogućena",
        description: "Sada možete primati prijave putem Telegrama."
      });
    } catch (error) {
      console.error("Error enabling Telegram:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške pri omogućavanju Telegram integracije.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const testTelegramWebhook = async () => {
    try {
      setSaving(true);
      
      // First, set up the webhook
      const setupResponse = await fetch(`/api/setup-telegram-webhook?webhook_url=${window.location.origin}/api/telegram-webhook`, {
        method: 'GET',
      });
      
      const setupData = await setupResponse.json();
      console.log("Webhook setup result:", setupData);
      
      // Then get info about the webhook
      const infoResponse = await fetch(`/api/test-telegram?chat_id=YOUR_CHAT_ID&message=Test message from RadoJobs at ${new Date().toLocaleTimeString()}`, {
        method: 'GET',
      });
      
      const infoData = await infoResponse.json();
      console.log("Webhook test result:", infoData);
      
      toast({
        title: "Telegram test completed",
        description: "Check console for details and your Telegram for messages"
      });
      
    } catch (error) {
      console.error("Error testing Telegram webhook:", error);
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom testiranja Telegram webhook-a.",
        variant: "destructive"
      });
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
                value="integrations" 
                className="data-[state=active]:bg-[#43AA8B]/10 data-[state=active]:text-[#43AA8B]"
              >
                <Shield className="h-4 w-4 mr-2" />
                Integracije
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
                  {/* Skeleton loader for profile fields */}
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-24 w-full mb-4" />
                </div>
              </Card>
            ) : (
              <>
                <TabsContent value="profile" className="mt-0">
                  <Card className="p-6 backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="company_name">Naziv tvrtke</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="company_name"
                            name="company_name"
                            placeholder="Naziv tvrtke"
                            className="pl-10"
                            value={profile.company_name}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="pl-10"
                            value={profile.email}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
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

                <TabsContent value="integrations" className="mt-0">
                  <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.198l-1.67 8.03c-.123.595-.45.738-.907.46l-2.507-1.885-1.209 1.188c-.16.158-.297.297-.594.297l.216-2.244 4.082-3.764c.275-.248-.056-.374-.43-.145l-5.035 3.23-2.158-.69c-.594-.197-.608-.596.13-.883l8.413-3.32c.498-.19.931.114.75.826z"/>
                        </svg>
                        Telegram integracija
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Omogućite komunikaciju s kandidatima putem Telegrama
                      </p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="telegram_enabled" className="font-medium text-gray-800 dark:text-gray-100">
                            Omogući Telegram
                          </Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Omogućite komunikaciju s kandidatima putem Telegrama
                          </p>
                        </div>
                        <Switch
                          id="telegram_enabled"
                          name="telegram_enabled"
                          checked={integrations.telegram_enabled}
                          onCheckedChange={(checked) => setIntegrations(prev => ({ ...prev, telegram_enabled: checked }))}
                          className="data-[state=checked]:bg-[#43AA8B]"
                        />
                      </div>

                      {integrations.telegram_enabled && (
                        <div className="space-y-2">
                          <Label htmlFor="telegram_bot_username">Telegram Bot korisničko ime</Label>
                          <div className="relative">
                            <svg 
                              className="absolute left-3 top-3 h-4 w-4 text-blue-500" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.198l-1.67 8.03c-.123.595-.45.738-.907.46l-2.507-1.885-1.209 1.188c-.16.158-.297.297-.594.297l.216-2.244 4.082-3.764c.275-.248-.056-.374-.43-.145l-5.035 3.23-2.158-.69c-.594-.197-.608-.596.13-.883l8.413-3.32c.498-.19.931.114.75.826z"/>
                            </svg>
                            <Input
                              id="telegram_bot_username"
                              name="telegram_bot_username"
                              placeholder="Radojobs_bot"
                              className="pl-10"
                              value={integrations.telegram_bot_username}
                              onChange={(e) => setIntegrations(prev => ({ ...prev, telegram_bot_username: e.target.value }))}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Korisničko ime vašeg Telegram bota (bez @ znaka)
                          </p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Webhook postavke</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Za pravilno funkcioniranje Telegram integracije, potrebno je postaviti webhook URL za vaš bot.
                        </p>
                        
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded border border-gray-200 dark:border-gray-700 mb-3">
                          <code className="text-sm text-gray-700 dark:text-gray-300 break-all">{integrations.webhook_url}</code>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            navigator.clipboard.writeText(integrations.webhook_url);
                            toast({
                              title: "Kopirano",
                              description: "Webhook URL kopiran u međuspremnik",
                            });
                          }}
                          className="w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Kopiraj webhook URL
                        </Button>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          Postavite webhook URL u Telegram BotFather ili koristite API za postavljanje webhooka.
                        </p>
                      </div>

                      <Button 
                        onClick={enableTelegram}
                        disabled={integrations.telegram_enabled || saving}
                        className="mt-2"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <svg 
                            className="h-4 w-4 mr-2 text-blue-500" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.198l-1.67 8.03c-.123.595-.45.738-.907.46l-2.507-1.885-1.209 1.188c-.16.158-.297.297-.594.297l.216-2.244 4.082-3.764c.275-.248-.056-.374-.43-.145l-5.035 3.23-2.158-.69c-.594-.197-.608-.596.13-.883l8.413-3.32c.498-.19.931.114.75.826z"/>
                          </svg>
                        )}
                        Brzo omogući Telegram
                      </Button>

                      <div className="space-y-3 mt-4">
                        <Button 
                          onClick={testTelegramWebhook}
                          variant="outline"
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <svg 
                              className="h-4 w-4 mr-2 text-blue-500" 
                              viewBox="0 0 24 24" 
                              fill="currentColor"
                            >
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.198l-1.67 8.03c-.123.595-.45.738-.907.46l-2.507-1.885-1.209 1.188c-.16.158-.297.297-.594.297l.216-2.244 4.082-3.764c.275-.248-.056-.374-.43-.145l-5.035 3.23-2.158-.69c-.594-.197-.608-.596.13-.883l8.413-3.32c.498-.19.931.114.75.826z"/>
                            </svg>
                          )}
                          Test Telegram Webhook
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex justify-end">
                      <Button 
                        onClick={saveIntegrations} 
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
