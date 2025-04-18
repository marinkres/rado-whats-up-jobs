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
        .select("id, name, phone");
      if (error) {
        console.error("Supabase candidates error:", error);
      }
      if (data) setCandidates(data);
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

  // Dohvati najnovije podatke za odabranog kandidata
  useEffect(() => {
    if (!selectedCandidate) return;
    let interval: NodeJS.Timeout;
    const fetchCandidate = async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", selectedCandidate.id)
        .single();
      if (!error && data) setSelectedCandidate(data);
    };
    fetchCandidate();
    // Poll svakih 3 sekunde za ažuriranje podataka kandidata
    interval = setInterval(fetchCandidate, 3000);
    return () => clearInterval(interval);
  }, [selectedCandidate?.id, selectedCandidate?.language_choice]); // <-- DODANO: ovisnost o language_choice

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;
    const newMsg = {
      conversation_id: conversationId,
      sender: "employer",
      content: message,
      sent_at: new Date().toISOString(),
    };
    // Prvo spremi poruku u Supabase
    const { error } = await supabase.from("messages").insert([newMsg]);
    if (error) {
      setChatHistory((prev) => [
        ...prev,
        { ...newMsg, content: "Failed to save message." },
      ]);
      setMessage("");
      return;
    }
    setChatHistory((prev) => [...prev, newMsg]);
    // Opcionalno: pošalji poruku kandidatu na WhatsApp preko backend API-ja
    try {
      await axios.post("/api/send-whatsapp", {
        message,
        conversation_id: conversationId,
        sender: "employer",
        candidate_id: selectedCandidate.id, // šaljemo i id kandidata
      });
    } catch (err) {
      // Možeš prikazati error ili ignorirati
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
                      {candidate.name?.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">
                        {candidate.name}
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
                    {/* Prikaži sažetak ako su svi podaci popunjeni */}
                    {selectedCandidate.name && selectedCandidate.languages && selectedCandidate.availability && selectedCandidate.experience ? (
                      <div className="bg-purple-50 rounded-lg p-4 mb-4">
                        <div className="font-semibold mb-2 text-purple-800">Podaci kandidata:</div>
                        <div className="text-sm text-purple-900">
                          <div><span className="font-medium">Ime i prezime:</span> {selectedCandidate.name}</div>
                          <div><span className="font-medium">Jezici:</span> {selectedCandidate.languages}</div>
                          <div><span className="font-medium">Dostupnost:</span> {selectedCandidate.availability}</div>
                          <div><span className="font-medium">Radno iskustvo:</span> {selectedCandidate.experience}</div>
                        </div>
                      </div>
                    ) : null}
                    {/* Prikaži samo poruke koje nisu dio onboarding popunjavanja */}
                    {chatHistory
                      .filter(chat => {
                        // Sakrij candidate poruke koje su identične s podacima kandidata
                        if (chat.sender !== "candidate") return true;
                        if (
                          chat.content === selectedCandidate.name ||
                          chat.content === selectedCandidate.languages ||
                          chat.content === selectedCandidate.availability ||
                          chat.content === selectedCandidate.experience
                        ) {
                          return false;
                        }
                        // Sakrij "PRIJAVA" poruku kandidata
                        if (chat.content.trim().toUpperCase() === "PRIJAVA") return false;
                        return true;
                      })
                      .map((chat, index) => (
                        <div
                          key={index}
                          className={`flex gap-2 ${
                            chat.sender === "employer"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {chat.sender === "candidate" && (
                            <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0" />
                          )}
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              chat.sender === "employer"
                                ? "bg-gray-100"
                                : "bg-purple-100"
                            }`}
                          >
                            <p className="text-sm">{chat.content}</p>
                            <span className="block text-xs text-gray-400">
                              {new Date(chat.sent_at).toLocaleTimeString()}
                            </span>
                          </div>
                          {chat.sender === "employer" && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
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
