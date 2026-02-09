import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { useAuth } from '../components/AuthContext';
import api from '../lib/api';

export default function Messages() {
  const router = useRouter();
  const { userId } = router.query;
  const { user, token, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Protect route
  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/');
    }
  }, [token, authLoading, router]);

  // Load conversations
  useEffect(() => {
    if (token && user) {
      loadConversations();
      // Poll for new messages every 5 seconds
      const interval = setInterval(loadConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      const interval = setInterval(() => loadMessages(selectedConversation.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  // Auto-select conversation from query params
  useEffect(() => {
    if (userId && conversations.length > 0) {
      const conv = conversations.find(
        c => c.other_user_id === parseInt(userId) || c.user_id === parseInt(userId)
      );
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [userId, conversations]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(response.data.data || []);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      await api.post(`/conversations/${selectedConversation.id}/messages`, {
        content: newMessage,
      });
      setNewMessage('');
      await loadMessages(selectedConversation.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (authLoading || !token || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-dark text-white">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary-light bg-opacity-20 border-l-4 border-primary'
                        : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-light text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {conversation.other_user_first_name?.[0]}
                        {conversation.other_user_last_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {conversation.other_user_first_name} {conversation.other_user_last_name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-2">Connect with members to start messaging</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-soft overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary to-primary-dark text-white">
                  <h3 className="text-lg font-semibold">
                    {selectedConversation.other_user_first_name}{' '}
                    {selectedConversation.other_user_last_name}
                  </h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={
                            message.sender_id === user.id
                              ? 'message-bubble-sent'
                              : 'message-bubble-received'
                          }
                        >
                          {message.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="input-primary flex-1"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingMessage ? '...' : 'Send'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p className="text-xl">Select a conversation</p>
                  <p className="text-sm mt-2">Or start a new one from your connections</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
