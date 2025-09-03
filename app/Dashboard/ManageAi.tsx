"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Key,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Copy,
  RefreshCw,
  Settings,
  MessageSquare,
  User
} from 'lucide-react';

// Types based on API documentation
interface SalesAIAssistant {
  id?: number;
  company: string;
  assistant_name: string;
  persona: string;
  rules: string;
  is_active: boolean;
  updated_at?: string;
}

interface CreateAIAssistantData {
  assistant_name: string;
  persona: string;
  rules: string;
  is_active: boolean;
}

interface APIKeyResponse {
  api_key: string;
  company_id: number;
  valid: boolean;
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

// AI Assistant Form Component
const AIAssistantForm: React.FC<{
  assistant?: SalesAIAssistant;
  onSubmit: (data: CreateAIAssistantData) => void;
  onCancel: () => void;
  loading: boolean;
}> = ({ assistant, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState<CreateAIAssistantData>({
    assistant_name: assistant?.assistant_name || '',
    persona: assistant?.persona || '',
    rules: assistant?.rules || '',
    is_active: assistant?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assistant Name *
        </label>
        <input
          type="text"
          value={formData.assistant_name}
          onChange={(e) => setFormData({...formData, assistant_name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          maxLength={100}
          placeholder="e.g., Asha, Alex, Maya"
        />
        <p className="text-xs text-gray-500 mt-1">The name customers will see (max 100 characters)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Persona *
        </label>
        <textarea
          value={formData.persona}
          onChange={(e) => setFormData({...formData, persona: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          rows={4}
          placeholder="Detailed description of the AI's personality, tone, and conversational style. E.g., 'A friendly and empathetic assistant who is an expert on tea and speaks in a warm, welcoming tone.'"
        />
        <p className="text-xs text-gray-500 mt-1">Describe the AI's personality, tone, and conversational style in detail</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rules *
        </label>
        <textarea
          value={formData.rules}
          onChange={(e) => setFormData({...formData, rules: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          rows={6}
          placeholder="Specific, hard rules the AI must follow. E.g.:
1. Always ask for confirmation before placing an order
2. Never discuss competitor products
3. Always mention free shipping on orders over $50"
        />
        <p className="text-xs text-gray-500 mt-1">List specific rules the AI must always follow</p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">AI Assistant is active</span>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : assistant ? 'Update Assistant' : 'Create Assistant'}
        </Button>
      </div>
    </form>
  );
};

const ManageAIPersona: React.FC = () => {
  const [assistants, setAssistants] = useState<SalesAIAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<SalesAIAssistant | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  // Fetch AI assistants
  const fetchAssistants = async () => {
    try {
      setLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/sales-ai/config/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch AI assistants (${response.status})`);
      }

      const data = await response.json();
      setAssistants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch API key
  const fetchApiKey = async () => {
    try {
      setActionLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/sales-ai/config/get-api-key/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch API key');
      }

      const data = await response.json();
      
      // Handle both possible response formats
      if (data) {
        if (data.api_key) {
          // Direct response format: { "message": "...", "api_key": "..." }
          setApiKey(data.api_key);
        } else if (Array.isArray(data) && data.length > 0 && data[0].api_key) {
          // Array response format from documentation
          setApiKey(data[0].api_key);
        } else {
          setApiKey('No API key found');
        }
      } else {
        setApiKey('No API key found');
      }
      setShowApiKeyModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API key');
    } finally {
      setActionLoading(false);
    }
  };

  // Create assistant
  const createAssistant = async (assistantData: CreateAIAssistantData) => {
    try {
      setActionLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/sales-ai/config/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(assistantData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create assistant');
      }

      await fetchAssistants();
      setShowCreateModal(false);
      showSuccess('AI Assistant created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create assistant');
    } finally {
      setActionLoading(false);
    }
  };

  // Update assistant
  const updateAssistant = async (assistantData: CreateAIAssistantData) => {
    if (!selectedAssistant) return;

    try {
      setActionLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/sales-ai/config/${selectedAssistant.id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(assistantData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update assistant');
      }

      await fetchAssistants();
      setShowEditModal(false);
      setSelectedAssistant(null);
      showSuccess('AI Assistant updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assistant');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete assistant
  const deleteAssistant = async () => {
    if (!selectedAssistant) return;

    try {
      setActionLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/sales-ai/config/${selectedAssistant.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete assistant');
      }

      await fetchAssistants();
      setShowDeleteModal(false);
      setSelectedAssistant(null);
      showSuccess('AI Assistant deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete assistant');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle assistant status
  const toggleAssistantStatus = async (assistant: SalesAIAssistant) => {
    try {
      setActionLoading(true);
      clearMessages();
      
      const response = await fetch(`${API_BASE}/sales-ai/config/${assistant.id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_active: !assistant.is_active }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update assistant status');
      }

      await fetchAssistants();
      showSuccess(`AI Assistant ${!assistant.is_active ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update assistant status');
    } finally {
      setActionLoading(false);
    }
  };

  // Copy API key to clipboard
  const copyApiKey = async () => {
    if (apiKey && apiKey !== 'No API key available' && apiKey !== 'No API key found') {
      try {
        await navigator.clipboard.writeText(apiKey);
        showSuccess('API key copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy API key:', err);
      }
    }
  };

  useEffect(() => {
    fetchAssistants();
  }, []);

  // Filter assistants
  const filteredAssistants = assistants.filter(assistant =>
    assistant.assistant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.persona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage AI Persona</h2>
          <p className="text-gray-600">Configure your AI assistant's personality and behavior</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchApiKey}
            disabled={actionLoading}
          >
            <Key className="w-4 h-4 mr-2" />
            Get API Key
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add AI Assistant
          </Button>
        </div>
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search assistants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Assistants List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAssistants.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No AI assistants found</h3>
          <p className="text-gray-600 mb-4">Create your first AI assistant to get started</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add AI Assistant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssistants.map((assistant) => (
            <div key={assistant.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{assistant.assistant_name}</h3>
                      <p className="text-sm text-gray-500">
                        {assistant.updated_at ? new Date(assistant.updated_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleAssistantStatus(assistant)}
                      className={`p-1 rounded ${assistant.is_active ? 'text-green-600' : 'text-gray-400'}`}
                      disabled={actionLoading}
                    >
                      {assistant.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {assistant.persona}
                </p>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    assistant.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {assistant.is_active ? 'Active' : 'Inactive'}
                  </span>
                  
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssistant(assistant);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAssistant(assistant);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedAssistant(assistant);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Assistant Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New AI Assistant"
        size="large"
      >
        <AIAssistantForm
          onSubmit={createAssistant}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Edit Assistant Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAssistant(null);
        }}
        title="Edit AI Assistant"
        size="large"
      >
        <AIAssistantForm
          assistant={selectedAssistant || undefined}
          onSubmit={updateAssistant}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedAssistant(null);
          }}
          loading={actionLoading}
        />
      </Modal>

      {/* View Assistant Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAssistant(null);
        }}
        title={`AI Assistant: ${selectedAssistant?.assistant_name}`}
        size="large"
      >
        {selectedAssistant && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assistant Name</label>
              <p className="text-gray-900">{selectedAssistant.assistant_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Persona</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedAssistant.persona}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rules</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">{selectedAssistant.rules}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-2">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedAssistant.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedAssistant.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {selectedAssistant.updated_at && (
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(selectedAssistant.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAssistant(null);
        }}
        title="Delete AI Assistant"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedAssistant?.assistant_name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedAssistant(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={deleteAssistant}
              disabled={actionLoading}
            >
              {actionLoading ? 'Deleting...' : 'Delete Assistant'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* API Key Modal */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => {
          setShowApiKeyModal(false);
          setApiKey(null);
        }}
        title="Company API Key"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Use this API key to integrate your AI assistant with external applications:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-900 break-all">
                {apiKey || 'Loading...'}
              </code>
              {apiKey && apiKey !== 'No API key available' && apiKey !== 'No API key found' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyApiKey}
                  className="ml-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Keep this key secure and don't share it publicly. Use it in your application's authentication headers.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAIPersona;