import React, { useState } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';
import { mockMessages } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

export function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Group messages by conversation (application)
  const conversations = mockMessages.reduce((acc, message) => {
    const key = message.loanApplicationId || 'general';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(message);
    return acc;
  }, {} as Record<string, typeof mockMessages>);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    console.log('Sending message:', {
      content: newMessage,
      conversationId: selectedConversation
    });

    setNewMessage('');
  };

  const getConversationTitle = (conversationId: string) => {
    if (conversationId === 'general') return 'General Messages';
    return `Application #${conversationId.slice(0, 8)}`;
  };

  const isMyMessage = (message: any) => {
    return message.senderId === user?.id;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with other platform users</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex h-96">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-full">
              {Object.keys(conversations).length === 0 ? (
                <div className="p-4 text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">No conversations yet</p>
                </div>
              ) : (
                Object.entries(conversations).map(([conversationId, messages]) => {
                  const lastMessage = messages[messages.length - 1];
                  const unreadCount = messages.filter(m => !m.isRead && m.receiverId === user?.id).length;
                  
                  return (
                    <div
                      key={conversationId}
                      onClick={() => setSelectedConversation(conversationId)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation === conversationId ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {getConversationTitle(conversationId)}
                        </h4>
                        {unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {lastMessage.messageContent}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(lastMessage.sentAt, 'MMM d, h:mm a')}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {getConversationTitle(selectedConversation)}
                  </h3>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversations[selectedConversation]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMyMessage(message)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {!isMyMessage(message) && (
                          <p className="text-xs font-medium mb-1 opacity-75">
                            {message.senderName}
                          </p>
                        )}
                        <p className="text-sm">{message.messageContent}</p>
                        <p className={`text-xs mt-1 ${isMyMessage(message) ? 'text-blue-100' : 'text-gray-500'}`}>
                          {format(message.sentAt, 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Select a conversation</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}