import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Send, 
  Calendar, 
  User, 
  MoreVertical, 
  MessageSquare, 
  ArrowLeft, 
  Archive,
  Trash,
  CheckCircle,
  XCircle,
  ChevronRight
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

// Skeleton loader component
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const Chat = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Get URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const conversationIdFromQuery = queryParams.get('conversation');

  const filteredConversations = conversations.filter(conv => {
    const candidateName = conv.candidateDetails?.name?.toLowerCase() || '';
    return candidateName.includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Get the current user's session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.error("No authenticated user");
          setLoading(false);
          return;
        }

        // Get employer ID by email
        const { data: employerData, error: employerError } = await supabase
          .from('employers')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (employerError) {
          console.error("Error fetching employer:", employerError);
          setLoading(false);
          return;
        }

        const employerId = employerData.id;

        // Get all conversations - remove the archived field since it doesn't exist
        const { data: conversationsData, error } = await supabase
          .from('conversations')
          .select('id, candidate_id, job_id, created_at, phone, job_listings(title)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Now fetch candidate details for each conversation
        if (conversationsData?.length > 0) {
          const candidateIds = conversationsData.map(conv => conv.candidate_id);
          const { data: candidatesData } = await supabase
            .from('candidates')
            .select('id, name, phone')
            .in('id', candidateIds);
            
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

  // Find application ID from candidate ID and job ID
  const findApplicationId = async (candidateId, jobId) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('candidate_id', candidateId)
        .eq('job_id', jobId)
        .maybeSingle();
      
      if (error) throw error;
      return data?.id;
    } catch (error) {
      console.error('Error finding application:', error);
      return null;
    }
  };

  // Navigate to application details
  const viewApplication = async () => {
    if (!selectedConversation) return;
    
    const applicationId = await findApplicationId(
      selectedConversation.candidate_id, 
      selectedConversation.job_id
    );
    
    if (applicationId) {
      navigate(`/applications/${applicationId}`);
    } else {
      console.log("Application not found");
    }
  };

  // Toggle mobile view
  const toggleChatView = (conversation = null) => {
    if (conversation) {
      setSelectedConversation(conversation);
      fetchMessages(conversation.id);
    }
    setShowChatMobile(!showChatMobile);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update the navigateToChat function to match your schema
  const navigateToChat = async (applicationId) => {
    try {
      // Get application details first
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('candidate_id, job_id')
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;
      
      if (!application?.candidate_id) return;

      // Check if conversation already exists
      const { data: existingConversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('candidate_id', application.candidate_id)
        .eq('job_id', application.job_id)
        .maybeSingle();

      if (convError) throw convError;
      
      // If conversation exists, navigate to it
      if (existingConversations?.id) {
        navigate(`/chat?conversation=${existingConversations.id}`);
        return;
      }
      
      // If no conversation exists, create one
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          candidate_id: application.candidate_id,
          job_id: application.job_id,
          phone: null, // We'll get this from the candidate info
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      
      // Navigate to the new conversation
      navigate(`/chat?conversation=${newConversation.id}`);
      
    } catch (error) {
      console.error("Error navigating to chat:", error);
    }
  };

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

          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700/50 shadow-sm overflow-hidden">
            <div className={`grid ${showChatMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
              {/* Conversations List - Hide on mobile when chat is shown */}
              <div className={cn(
                "border-r border-gray-200 dark:border-gray-700/50",
                showChatMobile && "hidden md:block"
              )}>
                {/* Search and Filter */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                    <Input 
                      placeholder="Pretraži razgovore..."  
                      className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Conversation List */}
                <div className="h-[calc(100vh-300px)] md:h-[calc(100vh-260px)] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
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
                    filteredConversations.map(conversation => {
                      // Get candidate name from candidateDetails
                      const candidateName = conversation.candidateDetails?.name || "Nepoznati kandidat";
                      
                      // Get the last message (or placeholder)
                      const lastMessage = messages.length > 0 && selectedConversation?.id === conversation.id
                        ? messages[messages.length - 1]?.content 
                        : "Kliknite za prikaz poruka";
                      
                      return (
                        <div 
                          key={conversation.id}
                          className={cn(
                            "relative flex items-center gap-3 p-4 cursor-pointer transition-colors",
                            "hover:bg-gray-50 dark:hover:bg-gray-800",
                            selectedConversation?.id === conversation.id && "bg-gray-100 dark:bg-gray-800"
                          )}
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              toggleChatView(conversation);
                            } else {
                              setSelectedConversation(conversation);
                              fetchMessages(conversation.id);
                            }
                          }}
                        >
                          {/* User avatar */}
                          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-[#43AA8B]">
                            <User className="h-5 w-5" />
                          </div>
                          
                          {/* Conversation details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                {candidateName}
                              </h3>
                              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                {new Date(conversation.created_at).toLocaleDateString("hr-HR")}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1 max-w-[250px]">
                              {conversation.job_listings?.title || "Nepoznati posao"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                              {lastMessage}
                            </p>
                          </div>
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
                      <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Još nemate razgovora</p>
                      <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                        Razgovori će se pojaviti kada primite prijave na oglase za posao i započnete komunikaciju s kandidatima.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages panel */}
              <div className={cn(
                "md:col-span-2 flex flex-col",
                !showChatMobile && "hidden md:flex"
              )}>
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between sticky top-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        {/* Back button for mobile */}
                        {showChatMobile && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="md:hidden" 
                            onClick={() => toggleChatView()}>
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                        )}
                        
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center text-[#43AA8B]">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-gray-200">
                            {selectedConversation.candidateDetails?.name || "Nepoznati kandidat"}
                          </h3>
                          <div className="flex gap-2 items-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedConversation.job_listings?.title || "Nepoznati posao"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={viewApplication} className="cursor-pointer">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>Pogledaj prijavu</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer">
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Izbriši razgovor</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-340px)] bg-gray-50/50 dark:bg-gray-900/30">
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
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700/50"
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
                    <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700/50 flex gap-2">
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
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;
