import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";

const Chat = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState<string | null>(null);

  // Dohvati prijavljenog korisnika
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setSender(data.user.email || data.user.id);
      }
    };
    getUser();
  }, []);
 
  // Dohvati sve kandidate iz baze
  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, first_name, last_name, phone");
      if (!error && data) setCandidates(data);
    };
    fetchCandidates();
  }, []);

  // Dohvati conversationId za odabranog kandidata
  useEffect(() => {
    if (!selectedCandidate) {
      setConversationId(null);
      setChatHistory([]);
      return;
    }
    const fetchConversation = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("id")
        .eq("candidate_id", selectedCandidate.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        setConversationId(data[0].id);
      } else {
        setConversationId(null);
        setChatHistory([]);
      }
    };
    fetchConversation();
  }, [selectedCandidate]);

  // Dohvati poruke za conversationId
  useEffect(() => {
    if (!conversationId) {
      setChatHistory([]);
      return;
    }
    let interval: NodeJS.Timeout;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("sent_at", { ascending: true });
      if (!error) setChatHistory(data || []);
    };
    fetchMessages();
    interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || !sender) return;
    setChatHistory((prev) => [
      ...prev,
      { sender, content: message, sent_at: new Date().toISOString() },
    ]);
    try {
      await axios.post("/api/send-whatsapp", {
        message,
        conversation_id: conversationId,
        sender,
      });
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
          "md:pl-64",
          "pl-0"
        )}
      >
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Kandidati</h2>
              <div className="space-y-2">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      selectedCandidate?.id === candidate.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {candidate.first_name?.[0]}
                      {candidate.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">
                        {candidate.first_name} {candidate.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{candidate.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="col-span-2 p-4">
              {selectedCandidate ? (
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
                          <span className="block text-xs text-gray-400">
                            {new Date(chat.sent_at).toLocaleTimeString()}
                          </span>
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
                      disabled={!conversationId}
                    />
                    <button
                      className="p-2 rounded-lg bg-purple-600 text-white"
                      onClick={handleSendMessage}
                      disabled={!conversationId}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Odaberite kandidata za prikaz poruka.
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
