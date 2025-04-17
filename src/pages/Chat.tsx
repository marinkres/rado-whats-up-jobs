import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { conversationId } = useParams(); // expects /chat/:conversationId
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sender, setSender] = useState<string | null>(null);

  // Get current user email or id from Supabase auth
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setSender(data.user.email || data.user.id);
      }
    };
    getUser();
  }, []);

  // Fetch messages from Supabase
  useEffect(() => {
    if (!conversationId) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true });
      if (!error) setChatHistory(data || []);
    };
    fetchMessages();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || !sender) return;
    setChatHistory((prev) => [
      ...prev,
      { sender, content: message, sent_at: new Date().toISOString() },
    ]);
    try {
      const response = await axios.post("/api/send-whatsapp", {
        message,
        conversation_id: conversationId,
        sender,
      });
      const reply = response.data.reply;
      setChatHistory((prev) => [
        ...prev,
        { sender: "agent", content: reply, sent_at: new Date().toISOString() },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "agent", content: "Failed to send message.", sent_at: new Date().toISOString() },
      ]);
    }
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300",
          "md:pl-64", // Add padding when the sidebar is open on desktop
          "pl-0" // No padding on mobile
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Razgovori</h2>
              <div className="space-y-4">
                <Input placeholder="Pretraži razgovore..." />

                <div className="space-y-2">
                  {["Ana Kovačić", "Marko Horvat", "Ivan Novak", "Petra Babić", "Tomislav Kralj"].map((name) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-gray-500">Online</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="col-span-2 p-4">
              <div className="flex flex-col h-[600px]">
                <div className="flex-1 overflow-auto space-y-4 mb-4">
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 ${chat.sender === sender ? "" : "justify-end"}`}
                    >
                      {chat.sender === sender && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[80%] ${
                          chat.sender === sender ? "bg-gray-100" : "bg-purple-100"
                        }`}
                      >
                        <p className="text-sm">{chat.content}</p>
                        <span className="block text-xs text-gray-400">{new Date(chat.sent_at).toLocaleTimeString()}</span>
                      </div>
                      {chat.sender !== sender && (
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Napišite poruku..."
                    className="flex-1"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className="p-2 rounded-lg bg-purple-600 text-white"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
