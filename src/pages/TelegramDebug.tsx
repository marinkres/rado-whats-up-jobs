import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TelegramChatIdDialog } from "@/components/TelegramChatIdDialog";

export default function TelegramDebug() {
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("Test message from RadoJobs");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookInfo, setWebhookInfo] = useState(null);
  const [botInfo, setBotInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultLog, setResultLog] = useState("");
  const [activeTab, setActiveTab] = useState("webhook");
  const [deployedWebhook, setDeployedWebhook] = useState("");
  const [showChatIdDialog, setShowChatIdDialog] = useState(false);
  
  useEffect(() => {
    // Set default webhook URL to current domain
    const defaultUrl = `${window.location.origin}/api/telegram-webhook`;
    setWebhookUrl(defaultUrl);
    
    // Check if we're on production
    if (window.location.hostname === "www.radojobs.eu") {
      setDeployedWebhook("https://www.radojobs.eu/api/telegram-webhook");
    } else {
      setDeployedWebhook(defaultUrl);
    }
    
    // Fetch current webhook info and bot info
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      // Get bot info
      await verifyBotToken();
      
      // Get webhook info
      await fetchWebhookInfo();
    } catch (error) {
      console.error("Error fetching status:", error);
      setResultLog(`Error fetching status: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyBotToken = async () => {
    try {
      const response = await fetch(`/api/verify-bot-token`);
      const data = await response.json();
      setBotInfo(data);
      
      let logText = "Bot Token Verification:\n";
      logText += JSON.stringify(data, null, 2);
      setResultLog(logText);
      
      if (data.error) {
        toast({
          title: "Bot Token Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying bot token:", error);
      setBotInfo({ error: error.message });
    }
  };

  const fetchWebhookInfo = async () => {
    try {
      const response = await fetch(`/api/get-webhook-info`);
      const data = await response.json();
      setWebhookInfo(data.webhookInfo?.result || null);
      
      let currentLog = resultLog;
      currentLog += "\n\nWebhook Info:\n";
      currentLog += JSON.stringify(data, null, 2);
      setResultLog(currentLog);
    } catch (error) {
      console.error("Error fetching webhook info:", error);
      setResultLog(resultLog + `\n\nError fetching webhook info: ${error.message}`);
    }
  };

  const setupWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please provide a webhook URL",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/setup-telegram-webhook?webhook_url=${encodeURIComponent(webhookUrl)}`);
      const data = await response.json();
      
      let logText = resultLog + "\n\nWebhook Setup Result:\n";
      logText += JSON.stringify(data, null, 2);
      setResultLog(logText);
      
      if (data.setupResult?.ok) {
        toast({
          title: "Success",
          description: "Webhook set up successfully",
        });
        await fetchWebhookInfo();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set up webhook",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting up webhook:", error);
      setResultLog(resultLog + `\n\nError setting up webhook: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to set up webhook: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!chatId) {
      setShowChatIdDialog(true);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/test-telegram?chat_id=${chatId}&message=${encodeURIComponent(message)}`);
      const data = await response.json();
      
      let logText = resultLog + "\n\nSend Message Result:\n";
      logText += JSON.stringify(data, null, 2);
      setResultLog(logText);
      
      if (data.messageSent?.ok) {
        toast({
          title: "Success",
          description: "Message sent successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending test message:", error);
      setResultLog(resultLog + `\n\nError sending test message: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChatId = (newChatId: string) => {
    setChatId(newChatId);
    
    // Save to localStorage for future use
    localStorage.setItem('telegram_chat_id', newChatId);
    
    // Immediately send a test message with the new chat ID
    if (newChatId) {
      setTimeout(() => sendTestMessage(), 100);
    }
  };
  
  // Load saved chat ID from localStorage
  useEffect(() => {
    const savedChatId = localStorage.getItem('telegram_chat_id');
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, []);

  const getStatusDetails = () => {
    // Calculate webhook status
    let webhookStatusColor = "text-gray-500";
    let webhookStatusIcon = <AlertTriangle className="h-5 w-5" />;
    let webhookStatusText = "Unknown";
    
    if (webhookInfo) {
      if (webhookInfo.url) {
        webhookStatusColor = "text-green-500";
        webhookStatusIcon = <CheckCircle className="h-5 w-5" />;
        webhookStatusText = "Configured";
      } else {
        webhookStatusColor = "text-red-500";
        webhookStatusIcon = <XCircle className="h-5 w-5" />;
        webhookStatusText = "Not Configured";
      }
    }
    
    // Calculate bot status
    let botStatusColor = "text-gray-500";
    let botStatusIcon = <AlertTriangle className="h-5 w-5" />;
    let botStatusText = "Unknown";
    
    if (botInfo) {
      if (botInfo.error) {
        botStatusColor = "text-red-500";
        botStatusIcon = <XCircle className="h-5 w-5" />;
        botStatusText = "Error";
      } else if (botInfo.botInfo) {
        botStatusColor = "text-green-500";
        botStatusIcon = <CheckCircle className="h-5 w-5" />;
        botStatusText = "Connected";
      }
    }
    
    return { webhookStatusColor, webhookStatusIcon, webhookStatusText, botStatusColor, botStatusIcon, botStatusText };
  };

  const { webhookStatusColor, webhookStatusIcon, webhookStatusText, botStatusColor, botStatusIcon, botStatusText } = getStatusDetails();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Telegram Integration Debug</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className={`flex items-center gap-2 ${botStatusColor}`}>
          <div className="font-medium">Bot Status:</div>
          <div className="flex items-center">
            {botStatusIcon}
            <span className="ml-1">{botStatusText}</span>
            {botInfo?.botInfo && <span className="ml-2 text-sm text-gray-500">({botInfo.botInfo.username})</span>}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 ${webhookStatusColor}`}>
          <div className="font-medium">Webhook Status:</div>
          <div className="flex items-center">
            {webhookStatusIcon}
            <span className="ml-1">{webhookStatusText}</span>
            {webhookInfo?.url && <span className="ml-2 text-sm text-gray-500 truncate max-w-[200px]">({webhookInfo.url})</span>}
          </div>
        </div>
      </div>
      
      <Button onClick={fetchStatus} variant="outline" className="mb-6">
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        Refresh Status
      </Button>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg">
          <TabsTrigger value="webhook">Webhook Configuration</TabsTrigger>
          <TabsTrigger value="message">Send Test Message</TabsTrigger>
          <TabsTrigger value="logs">Debug Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="webhook" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Set up and test the Telegram webhook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Webhook URL</label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-domain.com/api/telegram-webhook"
                  />
                </div>
                
                {deployedWebhook && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Use Production Webhook</label>
                    <Button 
                      variant="outline" 
                      onClick={() => setWebhookUrl(deployedWebhook)}
                      className="w-full"
                    >
                      Set to {deployedWebhook}
                    </Button>
                  </div>
                )}
                
                {webhookInfo && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 text-sm">
                    <h3 className="font-medium mb-2">Current Webhook Configuration</h3>
                    <div><strong>URL:</strong> {webhookInfo.url || "Not set"}</div>
                    <div><strong>Has custom certificate:</strong> {webhookInfo.has_custom_certificate ? "Yes" : "No"}</div>
                    <div><strong>Pending updates:</strong> {webhookInfo.pending_update_count}</div>
                    <div><strong>Max connections:</strong> {webhookInfo.max_connections}</div>
                    {webhookInfo.last_error_date && (
                      <div className="text-red-500 mt-2">
                        <strong>Last error:</strong> {webhookInfo.last_error_message}<br />
                        <strong>Time:</strong> {new Date(webhookInfo.last_error_date * 1000).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={setupWebhook} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Set Webhook
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="message" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Test Message</CardTitle>
              <CardDescription>Send a test message to a Telegram user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Chat ID</label>
                  <Input
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="Your Telegram chat ID"
                  />
                  <p className="text-xs text-gray-500">
                    Message @userinfobot on Telegram to get your chat ID
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={sendTestMessage} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Send Test Message
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Logs</CardTitle>
              <CardDescription>View response data and error messages</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resultLog}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => setResultLog("")}
                className="w-full"
              >
                Clear Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <TelegramChatIdDialog 
        open={showChatIdDialog} 
        onOpenChange={setShowChatIdDialog} 
        onSave={handleSaveChatId} 
      />
    </div>
  );
}
