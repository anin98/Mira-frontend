'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import { MessageCircle, Edit3, User, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert } from 'antd';

interface CustomerData {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  };
  name: string;
  phone_number: string;
  email: string;
  address: string;
}

const CustomerDashboard: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [userIdFromApi, setUserIdFromApi] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    name: '',
    address: '',
    phoneNumber: '',
    username: ''
  });

  const [originalData, setOriginalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    name: '',
    address: '',
    phoneNumber: '',
    username: ''
  });

  // Fetch customer profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('userId');

        if (!accessToken || !userId) {
          router.push('/CustomerAuth');
          return;
        }

        const response = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data: CustomerData = await response.json();

          console.log('🔍 Initial profile data:', data);
          console.log('🔍 User ID from data.user.id:', data.user?.id);

          // Set the customer ID from the API response (data.id) for PUT requests
          setCustomerId(data.id.toString());

          // Store the user ID for nested user updates
          const userId = data.user?.id || 0;
          setUserIdFromApi(userId);
          console.log('✅ Stored user ID in state:', userId);

          const profileData = {
            firstName: data.user?.first_name || '',
            lastName: data.user?.last_name || '',
            email: data.email || data.user?.email || '',
            name: data.name || '',
            address: data.address || '',
            phoneNumber: data.phone_number || '',
            username: data.user?.username || ''
          };

          setFormData(profileData);
          setOriginalData(profileData);
        } else {
          setError('Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.name) {
      setError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken || !customerId) {
        setError('Authentication required');
        return;
      }

      const payload = {
        user: {
          id: userIdFromApi,
          username: formData.username || `user_${formData.phoneNumber}`,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email
        },
        name: formData.name,
        phone_number: formData.phoneNumber,
        email: formData.email,
        address: formData.address || ''
      };

      console.log('📤 Sending PUT request with payload:', payload);
      console.log('📤 Customer ID:', customerId);
      console.log('📤 User ID from API:', userIdFromApi);

      const response = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${customerId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedData: CustomerData = await response.json();
        console.log('✅ Profile updated successfully. API Response:', updatedData);

        const newData = {
          firstName: updatedData.user?.first_name || '',
          lastName: updatedData.user?.last_name || '',
          email: updatedData.email || updatedData.user?.email || '',
          name: updatedData.name || '',
          address: updatedData.address || '',
          phoneNumber: updatedData.phone_number || '',
          username: updatedData.user?.username || ''
        };

        console.log('📝 New data to be set:', newData);

        // Update localStorage with new data
        localStorage.setItem('firstName', newData.firstName);
        localStorage.setItem('lastName', newData.lastName);
        localStorage.setItem('displayName', newData.name);
        localStorage.setItem('email', newData.email);

        // Trigger storage event to update header
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));

        setOriginalData(newData);
        setFormData(newData);
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);

        console.log('✅ State updated. FormData:', newData);

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = () => {
    router.push('/Chat');
  };

  if (isFetching) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50">
          <div className="text-center bg-white rounded-xl p-8 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {formData.name || 'User'}!
            </h1>
            <p className="text-gray-600">Manage your profile and chat with MIRA AI</p>
          </div>
          <Button
            onClick={openChat}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Open Chat
          </Button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Profile Section */}
          <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Success/Error Messages */}
              {successMessage && (
                <Alert
                  message="Success"
                  description={successMessage}
                  type="success"
                  showIcon
                  className="mb-6"
                />
              )}

              {error && (
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                  className="mb-6"
                />
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name">Display Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="How should we call you?"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      className="mt-1 bg-gray-50"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Phone number cannot be changed</p>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-base font-medium text-gray-900">
                          {formData.firstName} {formData.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Display Name</p>
                        <p className="text-base font-medium text-gray-900">{formData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base font-medium text-gray-900">{formData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-base font-medium text-gray-900">{formData.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-base font-medium text-gray-900">
                          {formData.address || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={openChat}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 z-50 group"
        aria-label="Open chat with MIRA"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with MIRA
        </span>
      </button>
    </div>
  );
};

export default CustomerDashboard;
