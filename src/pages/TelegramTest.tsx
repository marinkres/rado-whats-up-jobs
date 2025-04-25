import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function TelegramTest() {
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("Test message from RadoJobs");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookInfo, setWebhookInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultLog, setResultLog] = useState("");

  useEffect(() => {
    // Set default webhook URL to current domain
    setWebhookUrl(`${window.location.origin}/api/telegram-webhook`);
    
    // Fetch current webhook info
    fetchWebhookInfo();
  }, []);

  const fetchWebhookInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/get-webhook-info`);
      const data = await response.json();
      setWebhookInfo(data.webhookInfo?.result || null);
      
      let logText = "Webhook Info:\n";
      logText += JSON.stringify(data, null, 2);
      setResultLog(logText);
    } catch (error) {
      console.error("Error fetching webhook info:", error);
      setResultLog(`Error fetching webhook info: ${error.message}`);
    } finally {
      setLoading(false);
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
      
      let logText = "Webhook Setup Result:\n";
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
          description: "Failed to set up webhook",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting up webhook:", error);
      setResultLog(`Error setting up webhook: ${error.message}`);
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
      toast({
        title: "Error",
        description: "Please provide a chat ID",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/test-telegram?chat_id=${chatId}&message=${encodeURIComponent(message)}`);
      const data = await response.json();
      
      let logText = "Send Message Result:\n";
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
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending test message:", error);
      setResultLog(`Error sending test message: ${error.message}`);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Telegram Integration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              {webhookInfo && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                  <div><strong>Current URL:</strong> {webhookInfo.url || "Not set"}</div>
                  <div><strong>Pending updates:</strong> {webhookInfo.pending_update_count}</div>
                  <div><strong>Last error:</strong> {webhookInfo.last_error_message || "None"}</div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={fetchWebhookInfo} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Get Info
            </Button>
            <Button onClick={setupWebhook} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Set Webhook
            </Button>
          </CardFooter>
        </Card>
        
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
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Result Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resultLog}
            readOnly
            rows={10}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
}
