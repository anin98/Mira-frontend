"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Truck, 
  CreditCard, 
  MapPin,
  AlertCircle,
  CheckCircle,
  Save,
  Edit,
  X
} from 'lucide-react';

// Types based on API documentation
interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Company {
  id?: number;
  user: User;
  name: string;
  whatsapp_number: string;
  email?: string;
  website?: string;
  created_at?: string;
  allow_cash_on_delivery: boolean;
  supports_home_delivery: boolean;
  delivery_scope: 'dhaka_only' | 'NATIONWIDE';
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "danger";
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
    danger: "bg-red-600 text-white hover:bg-red-700"
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

// Input Field Component
const InputField: React.FC<{
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  maxLength?: number;
  min?: number;
  max?: number;
}> = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false,
  icon,
  maxLength,
  min,
  max
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

const ManageCompany: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // API Base URL
  const API_BASE = 'https://api.grayscale-technologies.com/api';

  // Get auth token and company ID
  const getAuthToken = () => localStorage.getItem('access_token');
  const getCompanyId = () => 1;

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

  // Fetch company data
  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID not found. Please log in again.');
      }

      const response = await fetch(`${API_BASE}/v1/companies/${companyId}/`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch company data (${response.status})`);
      }

      const data = await response.json();
      setCompany(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update company data
  const updateCompany = async (updatedData: Partial<Company>) => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccess(null);
      
      const companyId = getCompanyId();
      if (!companyId) {
        throw new Error('Company ID not found. Please log in again.');
      }

      const response = await fetch(`${API_BASE}/v1/companies/${companyId}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedData),
      });

      if (response.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update company (${response.status})`);
      }

      const data = await response.json();
      setCompany(data);
      setIsEditing(false);
      setSuccess('Company information updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle form submission
  const handleSave = () => {
    if (!company) return;
    updateCompany(company);
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof Company, value: any) => {
    if (!company) return;
    setCompany({
      ...company,
      [field]: value
    });
  };

  // Handle user field changes
  const handleUserFieldChange = (field: keyof User, value: string) => {
    if (!company) return;
    setCompany({
      ...company,
      user: {
        ...company.user,
        [field]: value
      }
    });
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Company</h2>
          <p className="text-gray-600">Configure your company settings and information</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Company</h2>
          <p className="text-gray-600">Configure your company settings and information</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600">Failed to load company data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Company</h2>
          <p className="text-gray-600">Configure your company settings and information</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  fetchCompany(); // Reset to original data
                }}
                disabled={saveLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
          )}
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Company Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 space-y-8">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Company Name"
                value={company.name}
                onChange={(value) => handleFieldChange('name', value)}
                placeholder="Enter company name"
                required
                disabled={!isEditing}
                icon={<Building2 className="w-4 h-4" />}
                maxLength={255}
              />
              
              <InputField
                label="WhatsApp Number"
                value={company.whatsapp_number}
                onChange={(value) => handleFieldChange('whatsapp_number', value)}
                placeholder="Enter WhatsApp number"
                required
                disabled={!isEditing}
                icon={<Phone className="w-4 h-4" />}
                maxLength={20}
              />

              <InputField
                label="Company Email"
                type="email"
                value={company.email || ''}
                onChange={(value) => handleFieldChange('email', value || undefined)}
                placeholder="Enter company email"
                disabled={!isEditing}
                icon={<Mail className="w-4 h-4" />}
                maxLength={254}
              />

              <InputField
                label="Website"
                type="url"
                value={company.website || ''}
                onChange={(value) => handleFieldChange('website', value || undefined)}
                placeholder="https://example.com"
                disabled={!isEditing}
                icon={<Globe className="w-4 h-4" />}
                maxLength={200}
              />
            </div>
          </div>

          {/* User Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Username"
                value={company.user.username}
                onChange={(value) => handleUserFieldChange('username', value)}
                placeholder="Enter username"
                required
                disabled={!isEditing}
                icon={<User className="w-4 h-4" />}
                maxLength={150}
              />

              <InputField
                label="Email Address"
                type="email"
                value={company.user.email}
                onChange={(value) => handleUserFieldChange('email', value)}
                placeholder="Enter email address"
                disabled={!isEditing}
                icon={<Mail className="w-4 h-4" />}
                maxLength={254}
              />

              <InputField
                label="First Name"
                value={company.user.first_name}
                onChange={(value) => handleUserFieldChange('first_name', value)}
                placeholder="Enter first name"
                disabled={!isEditing}
                maxLength={150}
              />

              <InputField
                label="Last Name"
                value={company.user.last_name}
                onChange={(value) => handleUserFieldChange('last_name', value)}
                placeholder="Enter last name"
                disabled={!isEditing}
                maxLength={150}
              />
            </div>
          </div>

          {/* Delivery Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Delivery Settings
            </h3>
            <div className="space-y-6">
              {/* Delivery Options */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={company.allow_cash_on_delivery}
                    onChange={(e) => handleFieldChange('allow_cash_on_delivery', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={!isEditing}
                  />
                  <CreditCard className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-700">Allow Cash on Delivery</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={company.supports_home_delivery}
                    onChange={(e) => handleFieldChange('supports_home_delivery', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={!isEditing}
                  />
                  <Truck className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-700">Supports Home Delivery</span>
                </label>
              </div>

              {/* Delivery Scope */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Scope <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery_scope"
                      value="dhaka_only"
                      checked={company.delivery_scope === 'dhaka_only'}
                      onChange={(e) => handleFieldChange('delivery_scope', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                    <MapPin className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">Dhaka Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery_scope"
                      value="NATIONWIDE"
                      checked={company.delivery_scope === 'NATIONWIDE'}
                      onChange={(e) => handleFieldChange('delivery_scope', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      disabled={!isEditing}
                    />
                    <Globe className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">NATIONWIDE</span>
                  </label>
                </div>
              </div>

              {/* Delivery Charges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Delivery Charge Inside Dhaka (৳)"
                  type="number"
                  value={company.delivery_charge_inside_dhaka}
                  onChange={(value) => handleFieldChange('delivery_charge_inside_dhaka', parseInt(value) || 0)}
                  placeholder="0"
                  disabled={!isEditing}
                  min={0}
                  max={2147483647}
                />

                <InputField
                  label="Delivery Charge Outside Dhaka (৳)"
                  type="number"
                  value={company.delivery_charge_outside_dhaka}
                  onChange={(value) => handleFieldChange('delivery_charge_outside_dhaka', parseInt(value) || 0)}
                  placeholder="0"
                  disabled={!isEditing}
                  min={0}
                  max={2147483647}
                />
              </div>
            </div>
          </div>

          {/* Company Stats */}
          {company.created_at && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Company ID:</strong> {company.id}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Created:</strong> {new Date(company.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCompany;