import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Send, Calendar, User, ChevronRight, MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState({});
  const messagesEndRef = useRef(null);

  // Get URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const conversationIdFromQuery = queryParams.get('conversation');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Get all conversations
        const { data: conversationsData, error } = await supabase
          .from('conversations')
          .select('id, candidate_id, job_id, created_at, phone')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log("Fetched conversations:", conversationsData);
        
        // Now fetch candidate details for each conversation
        if (conversationsData?.length > 0) {
          const candidateIds = conversationsData.map(conv => conv.candidate_id);
          const { data: candidatesData } = await supabase
            .from('candidates')
            .select('id, name, phone')
            .in('id', candidateIds);
            
          console.log("Fetched candidates:", candidatesData);
          
          // Create a lookup object for candidates
          const candidatesMap = {};
          candidatesData?.forEach(candidate => {
            candidatesMap[candidate.id] = candidate;
          });
          
          // Attach candidate details to conversations
          const enhancedConversations = conversationsData.map(conv => ({
            ...conv,
            candidateDetails: candidatesMap[conv.candidate_id] || null
          }));
          
          setConversations(enhancedConversations);
          setCandidateDetails(candidatesMap);
          
          // Select the first conversation or the one from query parameter
          if (enhancedConversations.length > 0) {
            // If we have a conversation ID in the URL, select that one
            if (conversationIdFromQuery) {
              const targetConversation = enhancedConversations.find(
                conv => conv.id === conversationIdFromQuery
              );
              
              if (targetConversation) {
                setSelectedConversation(targetConversation);
                fetchMessages(targetConversation.id);
              } else {
                // If conversation not found, select the first one
                setSelectedConversation(enhancedConversations[0]);
                fetchMessages(enhancedConversations[0].id);
              }
            } else {
              // No specific conversation requested, select the first one
              setSelectedConversation(enhancedConversations[0]);
              fetchMessages(enhancedConversations[0].id);
            }
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [conversationIdFromQuery]);

  const fetchMessages = async (conversationId) => {
    setMessageLoading(true);
    try {
      // Fetch messages using the correct columns from the messages table
      const { data, error } = await supabase
        .from('messages')
        .select('id, conversation_id, sender, content, sent_at')
        .eq('conversation_id', conversationId)
        .order('sent_at', { ascending: true });
      
      if (error) throw error;
      
      console.log("Fetched messages:", data);
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessageLoading(false);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    // Create a message object based on the database schema
    const message = {
      conversation_id: selectedConversation.id,
      sender: 'employer', // Using 'employer' instead of 'employer_type'
      content: newMessage,
      sent_at: new Date().toISOString(), // Using 'sent_at' instead of 'created_at'
    };

    try {
      // Optimistically update UI
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Send to API
      const { error } = await supabase.from('messages').insert([message]);
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="md:pl-72 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">Razgovori</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
            {/* Conversations List */}
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden md:col-span-1">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <Input 
                    placeholder="Pretraži razgovore..." 
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100vh-310px)] divide-y divide-gray-100 dark:divide-gray-700/50">
                {loading && !conversations.length ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  conversations.map(conversation => {
                    // Get candidate name from the candidateDetails
                    const candidateName = conversation.candidateDetails?.name || "Nepoznati kandidat";
                    
                    // Get the most recent message for this conversation (if any)
                    const lastMessage = messages.length > 0 && selectedConversation?.id === conversation.id
                      ? messages[messages.length - 1]?.content 
                      : "Kliknite za prikaz poruka";
                    
                    return (
                      <div 
                        key={conversation.id}
                        className={cn(
                          "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                          "hover:bg-gray-50 dark:hover:bg-gray-800",
                          selectedConversation?.id === conversation.id && "bg-gray-100 dark:bg-gray-800"
                        )}
                        onClick={() => {
                          setSelectedConversation(conversation);
                          fetchMessages(conversation.id);
                        }}
                      >
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-[#43AA8B]">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                            {candidateName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {lastMessage}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {new Date(conversation.created_at).toLocaleDateString("hr-HR")}
                        </span>
                      </div>
                    );
                  })
                )}
                
                {/* No conversations state */}
                {!loading && conversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-56 p-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                      <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Nema aktivnih razgovora</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Messages */}
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden md:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-[#43AA8B]">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {selectedConversation.candidateDetails?.name || "Nepoznati kandidat"}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedConversation.candidateDetails?.phone || selectedConversation.phone || ""}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      Više informacija <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-380px)]">
                    {messageLoading ? (
                      // Loading skeleton for messages
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700/50' : 'bg-[#43AA8B]/20'} rounded-lg p-3`}>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                              <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">Započnite razgovor sa kandidatom</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-xs">
                              Pošaljite prvu poruku kako biste uspostavili komunikaciju
                            </p>
                          </div>
                        ) : (
                          messages.map((message, index) => {
                            const isEmployer = message.sender === 'employer';
                            return (
                              <div key={index} className={`flex ${isEmployer ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                  className={cn(
                                    "max-w-[70%] rounded-lg p-3",
                                    isEmployer 
                                      ? "bg-[#43AA8B]/20 dark:bg-[#43AA8B]/30 text-gray-800 dark:text-gray-100" 
                                      : "bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200"
                                  )}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                                    {new Date(message.sent_at).toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 dark:border-gray-700/50 flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Napišite poruku..."
                      className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="bg-[#43AA8B] hover:bg-[#43AA8B]/80 text-white"
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Pošalji</span>
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Niste odabrali razgovor
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Odaberite razgovor iz liste ili pokrenite novi razgovor s kandidatom.
                  </p>
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
