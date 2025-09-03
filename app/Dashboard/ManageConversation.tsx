"use client";

import React, { useState, useEffect } from 'react';
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
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal states
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // API Base URL
  const API_BASE = 'https://api.grayscale-technologies.com/api';

  // Get auth token
  const getAuthToken = () => localStorage.getItem('access_token');

  // Get auth headers
  const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
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
    setTimeout(() => setSuccess(null), 3000);
  };

  // Fetch conversations list - replace with actual endpoint when available
  const fetchConversations = async () => {
    try {
      setLoading(true);
      clearMessages();
      
      // Replace this URL with your actual conversations list endpoint
      const response = await fetch(`${API_BASE}/dashboard/conversations/`, {
        headers: getAuthHeaders(),
      });
      
      // For now, set empty array until you provide the conversations list endpoint
      setConversations([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  // Fetch conversation details and messages
  const fetchConversationDetails = async (conversationId: string) => {
    try {
      setConversationLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/dashboard/1/conversation/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch conversation details (${response.status})`);
      }

      const data = await response.json();
      
      // Update selected conversation with full details
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation({
          ...selectedConversation,
          messages: data.messages || [],
          ...data // Merge any other details from the response
        });
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversation details');
      throw err;
    } finally {
      setConversationLoading(false);
    }
  };

  // Handle opening conversation modal
  const openConversationModal = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversationModal(true);
    
    // Fetch full conversation details including messages
    try {
      await fetchConversationDetails(conversation.id);
    } catch (err) {
      console.error('Failed to fetch conversation details:', err);
    }
  };

  // Send message to conversation
  const sendMessage = async (conversationId: string, message: string) => {
    try {
      setSendingMessage(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/dashboard/${conversationId}/send-message/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          message: message,
          sender: 'agent'
        }),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to send message');
      }

      // Add message to local state immediately for better UX
      if (selectedConversation) {
        const newMsg: Message = {
          content: message,
          sender: 'agent',
          timestamp: new Date().toISOString()
        };
        
        setSelectedConversation({
          ...selectedConversation,
          messages: [...(selectedConversation.messages || []), newMsg]
        });
      }

      setNewMessage('');
      showSuccess('Message sent successfully!');
      
      // Refresh conversation details
      if (selectedConversation) {
        setTimeout(() => {
          fetchConversationDetails(selectedConversation.id);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  // Switch conversation to autopilot mode
  const switchToAutopilot = async (conversationId: string) => {
    try {
      setActionLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/dashboard/1/switch-mode/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to switch to autopilot mode');
      }

      // Update local state
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, mode: 'autopilot', status: 'autopilot' }
          : conv
      ));

      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation({
          ...selectedConversation,
          mode: 'autopilot',
          status: 'autopilot'
        });
      }

      showSuccess('Conversation switched to autopilot mode!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch to autopilot mode');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return;
    sendMessage(selectedConversation.id, newMessage.trim());
  };

  // Handle key press in message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.customer_phone?.includes(searchTerm) ||
                         conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || conv.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string, mode: string) => {
    if (mode === 'autopilot') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Zap className="w-3 h-3 mr-1" />
          Autopilot
        </span>
      );
    }
    
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <MessageCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Conversations</h2>
          <p className="text-gray-600">View and manage customer conversations with Mira AI</p>
        </div>
        <Button onClick={fetchConversations} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-600">{success}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
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
          <p className="text-gray-600">Conversations will appear here when customers start chatting with your AI assistant</p>
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
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openConversationModal(conversation)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        {conversation.mode !== 'autopilot' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => switchToAutopilot(conversation.id)}
                            disabled={actionLoading}
                          >
                            <Zap className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
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
          <div className="flex flex-col h-96">
            {/* Conversation Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedConversation.customer_name}</div>
                  <div className="text-sm text-gray-500">{selectedConversation.customer_phone}</div>
                </div>
              </div>
              {getStatusBadge(selectedConversation.status, selectedConversation.mode)}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto py-4">
              {conversationLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((message, index) => (
                  <MessageBubble key={message.id || index} message={message} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No messages in this conversation yet
                </div>
              )}
            </div>

            {/* Message Input */}
            {selectedConversation.mode !== 'autopilot' && (
              <div className="pt-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                {selectedConversation.mode === 'manual' && (
                  <div className="mt-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => switchToAutopilot(selectedConversation.id)}
                      disabled={actionLoading}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Switch to Autopilot
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {selectedConversation.mode === 'autopilot' && (
              <div className="pt-4 border-t">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm text-purple-800">
                      This conversation is in autopilot mode. The AI is handling responses automatically.
                    </span>
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