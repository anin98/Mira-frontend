'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert } from 'antd';
import Header from '../components/header';

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

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [userIdFromApi, setUserIdFromApi] = useState<number>(0);

  const [formData, setFormData] = useState({
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

        setCustomerId(userId);

        const response = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${userId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data: CustomerData = await response.json();

          // Set the customer ID from the API response (data.id) for PUT requests
          setCustomerId(data.id.toString());

          // Store the user ID for nested user updates
          setUserIdFromApi(data.user?.id || 0);

          setFormData({
            firstName: data.user?.first_name || '',
            lastName: data.user?.last_name || '',
            email: data.email || data.user?.email || '',
            name: data.name || '',
            address: data.address || '',
            phoneNumber: data.phone_number || '',
            username: data.user?.username || ''
          });
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

      const response = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${customerId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedData: CustomerData = await response.json();

        // Update localStorage with new data
        localStorage.setItem('firstName', updatedData.user?.first_name || '');
        localStorage.setItem('lastName', updatedData.user?.last_name || '');
        localStorage.setItem('displayName', updatedData.name || '');
        localStorage.setItem('email', updatedData.email || updatedData.user?.email || '');

        // Trigger storage event to update header
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));

        setSuccessMessage('Profile updated successfully!');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/Dashboard');
        }, 2000);
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

  if (isFetching) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white rounded-xl p-8 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
              <p className="text-gray-600">Update your personal information</p>
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
                    className="mt-1 border-gray-300 focus:border-blue-500"
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
                    className="mt-1 border-gray-300 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:border-blue-500"
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
                  onChange={handleInputChange}
                  placeholder="01XXXXXXXXX"
                  className="mt-1 border-gray-300 focus:border-blue-500"
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
                  className="mt-1 border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/Dashboard')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
