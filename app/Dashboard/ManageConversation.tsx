"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Search, 
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Zap,
  X,
  RefreshCw
} from 'lucide-react';

// Types based on API structure
interface Message {
  id?: number;
  content: string;
  sender: 'user' | 'agent' | 'ai';
  timestamp: string;
  message_type?: 'text' | 'system';
}

interface Conversation {
  id: string;
  session_id?: string;
  customer_name?: string;
  customer_phone?: string;
  status: 'active' | 'closed' | 'autopilot';
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message?: string;
  mode: 'manual' | 'autopilot';
  messages?: Message[];
}

// API Response Types
interface InboxResponse {
  id?: string;
  session_id?: string;
  customer_name?: string;
  customer_phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  message_count?: number;
  last_message?: string;
  mode?: string;
}


// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "danger" | "success";
  size?: "default" | "sm";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  variant = "default",
  size = "default",
  ...props 
}) => {
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700"
  };
  
  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "default" | "large";
}> = ({ isOpen, onClose, title, children, size = "default" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    default: "max-w-2xl",
    large: "max-w-4xl"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Alert Component
const Alert: React.FC<{
  type: 'error' | 'success';
  message: string;
  onClose: () => void;
}> = ({ type, message, onClose }) => {
  const styles = type === 'error' 
    ? 'bg-red-50 border-red-200 text-red-800'
    : 'bg-green-50 border-green-200 text-green-800';
  
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${styles} mb-6`}>
      <div className="flex items-center">
        <Icon className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-current hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Message Component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAgent = message.sender === 'agent';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser 
          ? 'bg-blue-600 text-white' 
          : isAgent
          ? 'bg-green-100 text-green-900 border border-green-200'
          : 'bg-gray-100 text-gray-900 border border-gray-200'
      }`}>
        <div className="flex items-center mb-1">
          {isUser ? (
            <User className="w-3 h-3 mr-1" />
          ) : isAgent ? (
            <User className="w-3 h-3 mr-1" />
          ) : (
            <Bot className="w-3 h-3 mr-1" />
          )}
          <span className="text-xs opacity-75">
            {isUser ? 'Customer' : isAgent ? 'Agent' : 'AI Assistant'}
          </span>
        </div>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-50 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

const ManageConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal states
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Ref for auto-scrolling messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API Base URL
  const API_BASE = 'https://api.grayscale-technologies.com/api';

  // Get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    return token;
  };

  // Get auth headers
  const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  // Show error message
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 8000);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  // Fetch conversations from inbox endpoint
  const fetchConversations = async () => {
    try {
      setLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/dashboard/inbox/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('access_token');
          showError('Session expired. Please log in again.');
          // Redirect to login page
          window.location.href = '/login';
          return;
        }
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }
      
      const data: InboxResponse[] = await response.json();
      
      // Map inbox data to conversations format
      const mappedConversations: Conversation[] = data.map((item) => ({
        id: item.session_id || item.id || '',
        session_id: item.session_id || item.id,
        customer_name: item.customer_name || 'Unknown Customer',
        customer_phone: item.customer_phone || 'No phone',
        status: (item.status as 'active' | 'closed' | 'autopilot') || 'active',
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        message_count: item.message_count || 0,
        last_message: item.last_message || 'No messages',
        mode: (item.mode as 'manual' | 'autopilot') || 'manual',
      }));
      
      setConversations(mappedConversations);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversations';
      showError(errorMessage);
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversation details and messages
  const fetchConversationDetails = async (sessionId: string) => {
    try {
      setConversationLoading(true);
      clearMessages();

      // Use the new messages-latest endpoint for ordered messages
      const response = await fetch(`${API_BASE}/dashboard/${sessionId}/messages-latest/`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversation details: ${response.status}`);
      }

      const data = await response.json();

      // Map the new API response format to our Message type
      const messages: Message[] = Array.isArray(data) ? data.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'ai' : msg.role === 'suggestion' ? 'ai' : 'agent',
        timestamp: msg.created_at,
        message_type: 'text'
      })) : [];

      // Update selected conversation with messages
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages
        };
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch conversation details';
      showError(errorMessage);
      console.error('Error fetching conversation details:', err);
    } finally {
      setConversationLoading(false);
    }
  };

  // Open conversation modal
  const openConversationModal = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversationModal(true);
    
    // Fetch messages
    const sessionId = conversation.session_id || conversation.id;
    if (sessionId) {
      await fetchConversationDetails(sessionId);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;
    
    const messageContent = newMessage.trim();
    const sessionId = selectedConversation.session_id || selectedConversation.id;
    
    try {
      setSendingMessage(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/chat/reply/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          session_id: sessionId,
          message: messageContent,
          sender: 'agent'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Add message to UI immediately for better UX
      const newMsg: Message = {
        id: result.id || Date.now(),
        content: messageContent,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        message_type: 'text'
      };
      
      setSelectedConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...(prev.messages || []), newMsg]
        };
      });
      
      setNewMessage('');
      showSuccess('Message sent successfully');
      
      // Optionally refresh conversation list to update last_message
      await fetchConversations();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      showError(errorMessage);
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get status badge
  const getStatusBadge = (status: string, mode: string) => {
    if (mode === 'autopilot') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Zap className="w-3 h-3 mr-1" />
          Autopilot
        </span>
      );
    }

    const statusConfig = {
      active: {
        color: 'bg-green-100 text-green-800',
        icon: MessageCircle,
        label: 'Active'
      },
      closed: {
        color: 'bg-gray-100 text-gray-800',
        icon: CheckCircle,
        label: 'Closed'
      },
      autopilot: {
        color: 'bg-purple-100 text-purple-800',
        icon: Zap,
        label: 'Autopilot'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.customer_phone?.includes(searchTerm) ||
      conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'autopilot' && conv.mode === 'autopilot') ||
      (statusFilter !== 'autopilot' && conv.status === statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, []);

  // Refresh conversations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Conversations</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage customer conversations with your AI assistant
            </p>
          </div>
          <Button
            onClick={fetchConversations}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess(null)} />
      )}

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'all' ? "default" : "outline"}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? "default" : "outline"}
            onClick={() => setStatusFilter('active')}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'autopilot' ? "default" : "outline"}
            onClick={() => setStatusFilter('autopilot')}
            size="sm"
          >
            Autopilot
          </Button>
          <Button
            variant={statusFilter === 'closed' ? "default" : "outline"}
            onClick={() => setStatusFilter('closed')}
            size="sm"
          >
            Closed
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Conversations will appear here when customers start chatting with your AI assistant'}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {conversation.customer_name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {conversation.customer_phone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {conversation.last_message || 'No messages'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversation.message_count || 0} messages
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(conversation.status, conversation.mode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(conversation.updated_at).toLocaleDateString()} {new Date(conversation.updated_at).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openConversationModal(conversation)}
                        title="View conversation"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Conversation Modal */}
      <Modal
        isOpen={showConversationModal}
        onClose={() => {
          setShowConversationModal(false);
          setSelectedConversation(null);
          setNewMessage('');
        }}
        title={`Chat with ${selectedConversation?.customer_name || 'Customer'}`}
        size="large"
      >
        {selectedConversation && (
          <div className="flex flex-col h-[600px]">
            {/* Conversation Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-lg">{selectedConversation.customer_name}</div>
                  <div className="text-sm text-gray-500">{selectedConversation.customer_phone}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {getStatusBadge(selectedConversation.status, selectedConversation.mode)}
                <span className="text-xs text-gray-500">
                  {selectedConversation.message_count || 0} messages
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4 space-y-2">
              {conversationLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                <>
                  {selectedConversation.messages.map((message, index) => (
                    <MessageBubble key={message.id || index} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No messages in this conversation yet</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            {selectedConversation.mode !== 'autopilot' ? (
              <div className="pt-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    {sendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Zap className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900 mb-1">
                        Autopilot Mode Active
                      </p>
                      <p className="text-sm text-purple-700">
                        This conversation is in autopilot mode. The AI is handling responses automatically.
                        Manual messaging is disabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageConversations;