import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, MessageCircle, User, Building } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  messageContent: string;
  sentAt: string;
  isRead: boolean;
  senderName?: string;
  loanApplicationId?: string;
}

interface Contact {
  id: string;
  name: string;
  role: 'fi' | 'smb';
  lastMessage?: string;
  unreadCount: number;
}

export default function Messages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock contacts data - in real app this would come from API
  const contacts: Contact[] = [
    {
      id: "fi-1",
      name: "National Bank of Uzbekistan",
      role: "fi",
      lastMessage: "We have reviewed your application...",
      unreadCount: 2
    },
    {
      id: "fi-2", 
      name: "Kapital Bank",
      role: "fi",
      lastMessage: "Thank you for your interest...",
      unreadCount: 0
    }
  ];

  // Real-time message state management
  const [messages, setMessages] = useState<Message[]>([]);

  // Load conversation messages when contact is selected
  useEffect(() => {
    if (selectedContact) {
      // Initialize with existing conversation
      const initialMessages: Message[] = [
        {
          id: "msg-1",
          senderId: selectedContact.id,
          receiverId: "current-user",
          messageContent: "Thank you for your loan application. We have received all your documents and are currently reviewing your request.",
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          senderName: selectedContact.name,
        },
        {
          id: "msg-2",
          senderId: "current-user",
          receiverId: selectedContact.id,
          messageContent: "Thank you for the update. Do you need any additional information from us?",
          sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: true,
        },
        {
          id: "msg-3",
          senderId: selectedContact.id,
          receiverId: "current-user",
          messageContent: "We may need updated financial statements for the current quarter. Can you provide those?",
          sentAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          isRead: false,
          senderName: selectedContact.name,
        }
      ];
      setMessages(initialMessages);
    } else {
      setMessages([]);
    }
  }, [selectedContact]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { receiverId: string; messageContent: string }) => {
      // For now, simulate successful message sending
      return new Promise((resolve) => {
        setTimeout(() => {
          const newMessage: Message = {
            id: Math.random().toString(36).substring(7),
            senderId: "current-user",
            receiverId: messageData.receiverId,
            messageContent: messageData.messageContent,
            sentAt: new Date().toISOString(),
            isRead: false,
          };
          
          // Add message to current conversation
          setMessages(prev => [...prev, newMessage]);
          resolve(newMessage);
        }, 500);
      });
    },
    onSuccess: () => {
      setNewMessage("");
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedContact || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      receiverId: selectedContact.id,
      messageContent: newMessage.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          </div>
          <p className="text-gray-600">
            Communicate directly with financial institutions about your loan applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Contacts List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {contacts.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No conversations yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Submit a loan application to start messaging with financial institutions.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {contact.role === 'fi' ? (
                              <Building className="h-5 w-5 text-blue-600" />
                            ) : (
                              <User className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {contact.role === 'fi' ? 'Financial Institution' : 'Business'}
                            </Badge>
                          </div>
                        </div>
                        {contact.unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{selectedContact.name}</CardTitle>
                      <p className="text-sm text-gray-500">Financial Institution</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-sm text-gray-400">Start the conversation below</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === "current-user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === "current-user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.messageContent}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === "current-user"
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(message.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a contact from the left to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}