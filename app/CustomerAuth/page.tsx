'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert } from 'antd';
import Squares from '../CompanyAuth/components/Square';
import Header from '../components/header';
import LoadingAnimation from '../components/LoadingAnimation';

const CustomerRegistration: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  
  // Phone verification states
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  
  // Auth data
  const [accessToken, setAccessToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  
  // Registration form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    name: '',
    address: ''
  });

  // Blue-themed Squares Background
  const SquaresBackground: React.FC = () => {
    return (
      <div className="absolute inset-0 z-0">
        <Squares 
          speed={0.4} 
          squareSize={50}
          direction='right'
          borderColor='rgba(30, 198, 255, 0.15)'
          hoverFillColor='rgba(30, 198, 255, 0.05)'
          mode="light"
        />
      </div>
    );
  };

  // Check if profile is complete (name and email exist)
  const isProfileComplete = (profileData: any) => {
    const hasName = profileData.name?.trim();
    const hasEmail = profileData.email?.trim() || profileData.user?.email?.trim();
    
    console.log('Profile completeness check:', {
      name: profileData.name,
      email: profileData.email,
      userEmail: profileData.user?.email,
      isComplete: hasName && hasEmail
    });
    
    return hasName && hasEmail;
  };

  // Store auth data and trigger header update
  const storeAuthData = (tokens: any, userIdFromApi: string) => {
    console.log('📦 Storing auth data...', { tokens, userIdFromApi });
    
    // Clear any existing data first
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');
    
    // Store new data
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('userId', userIdFromApi);
    
    // Update state
    setAccessToken(tokens.access);
    setUserId(userIdFromApi);
    
    // Trigger events for header to detect login
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('loginStatusChanged'));
    
    console.log('✅ Auth data stored successfully');
    console.log('Stored tokens:', {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token'),
      userId: localStorage.getItem('userId')
    });
  };

  // Store complete profile data
  const storeProfileData = (profileData: any) => {
    console.log('📦 Storing profile data:', profileData);
    
    localStorage.setItem('customerId', profileData.id?.toString() || '');
    localStorage.setItem('firstName', profileData.user?.first_name || '');
    localStorage.setItem('lastName', profileData.user?.last_name || '');
    localStorage.setItem('displayName', profileData.name || '');
    localStorage.setItem('email', profileData.email || profileData.user?.email || '');
    
    // Trigger storage events
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('loginStatusChanged'));
    
    console.log('✅ Profile data stored and events triggered');
    console.log('Stored profile:', {
      customerId: localStorage.getItem('customerId'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      displayName: localStorage.getItem('displayName'),
      email: localStorage.getItem('email')
    });
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const id = localStorage.getItem('userId');
        
        console.log('🔍 Checking existing auth:', { hasToken: !!token, hasId: !!id });
        
        if (!token || !id) {
          console.log('❌ No auth data found');
          setIsAuthenticated(false);
          setIsAuthChecking(false);
          return;
        }
        
        setAccessToken(token);
        setUserId(id);
        
        // Check profile without token verification
        console.log(`🔄 Fetching profile for user ID: ${id}`);
        const profileResponse = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Profile data received:', profileData);
          
          if (isProfileComplete(profileData)) {
            console.log('✅ Profile complete, redirecting to CustomerDashboard');
            storeProfileData(profileData);
            setIsNavigating(true);
            setTimeout(() => {
              window.location.href = '/CustomerDashboard';
            }, 500);
            return;
          } else {
            console.log('📝 Profile incomplete, showing form');
            setFormData({
              firstName: profileData.user?.first_name || '',
              lastName: profileData.user?.last_name || '',
              email: profileData.email || profileData.user?.email || '',
              name: profileData.name || '',
              address: profileData.address || ''
            });
            setPhoneNumber(profileData.phone_number || '');
          }
        } else if (profileResponse.status === 401) {
          // Token is invalid, clear auth data
          console.log('❌ Token invalid (401), clearing auth data');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('userId');
          setIsAuthenticated(false);
          setIsAuthChecking(false);
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Auth check error:', error);
        // Don't clear data on network errors
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const requestOtp = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid Bangladesh phone number (01XXXXXXXXX)');
      return;
    }

    setOtpLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log('📱 Requesting OTP for:', phoneNumber);
      const response = await fetch('https://api.grayscale-technologies.com/api/auth/request-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber.trim() })
      });

      const responseData = await response.json();
      console.log('📱 OTP request response:', responseData);

      if (response.ok) {
        setOtpSent(true);
        setSuccessMessage('OTP sent successfully! Please check your phone.');
      } else {
        setError(responseData.message || responseData.detail || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ OTP request error:', error);
      setError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      console.log('🔐 Verifying OTP...');
      
      const response = await fetch('https://api.grayscale-technologies.com/api/auth/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          otp: otp.trim()
        })
      });

      const responseData = await response.json();
      console.log('🔐 OTP verification response:', responseData);

      if (response.ok) {
        console.log('✅ OTP verified successfully');
        
        // Extract authentication data from response
        const { access, refresh, id } = responseData;
        
        if (!access || !refresh || !id) {
          console.error('❌ Missing auth data in response:', responseData);
          setError('Authentication failed. Missing required data.');
          return;
        }
        
        // Store authentication data
        storeAuthData({ access, refresh }, id.toString());
        
        // Wait a moment to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check customer profile using the ID
        console.log(`🔄 Checking profile for customer ID: ${id}`);
        
        const profileResponse = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${id}/`, {
          headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('✅ Profile data received:', profileData);
          
          // Check if name and email exist
          if (isProfileComplete(profileData)) {
            console.log('✅ Profile complete - logging in user');
            
            // Store complete profile data
            storeProfileData(profileData);

            setSuccessMessage('Login successful! Redirecting to dashboard...');
            setIsNavigating(true);

            // Wait longer to ensure all data is properly stored
            setTimeout(() => {
              console.log('🔄 Redirecting to CustomerDashboard...');
              console.log('Final auth check before redirect:', {
                access_token: localStorage.getItem('access_token'),
                userId: localStorage.getItem('userId'),
                displayName: localStorage.getItem('displayName')
              });

              // Use window.location.replace to avoid back button issues
              window.location.replace('/CustomerDashboard');
            }, 2000);
            return;
          } else {
            console.log('📝 Profile incomplete - showing registration form');
            
            // Pre-fill form with existing data
            setFormData({
              firstName: profileData.user?.first_name || '',
              lastName: profileData.user?.last_name || '',
              email: profileData.email || profileData.user?.email || '',
              name: profileData.name || '',
              address: profileData.address || ''
            });
            
            setIsAuthenticated(true);
            setSuccessMessage('Phone verified! Please complete your profile.');
          }
        } else if (profileResponse.status === 404) {
          console.log('📝 No profile found - showing registration form');
          setIsAuthenticated(true);
          setSuccessMessage('Phone verified! Please complete your registration.');
        } else {
          console.log('⚠️ Profile check failed - showing registration form');
          setIsAuthenticated(true);
          setSuccessMessage('Phone verified! Please complete your registration.');
        }
      } else {
        setError(responseData.message || responseData.detail || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateUsername = (firstName: string, lastName: string, phone: string): string => {
    const timestamp = Date.now();
    const phoneLastFour = phone.slice(-4);
    return `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${phoneLastFour}_${timestamp}`;
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
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
      console.log('🔄 Submitting registration...');
      
      const username = generateUsername(formData.firstName, formData.lastName, phoneNumber);
      
      const payload = {
        user: {
          username: username,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName
        },
        name: formData.name,
        phone_number: phoneNumber,
        email: formData.email,
        address: formData.address || ''
      };

      console.log('📤 Registration payload:', payload);

      const response = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('📥 Registration response:', responseData);

      if (response.ok) {
        console.log('✅ Registration successful');
        
        // Store complete profile data
        storeProfileData(responseData);

        setSuccessMessage('Account created successfully! Redirecting to dashboard...');
        setIsNavigating(true);

        // Wait longer to ensure all data is properly stored
        setTimeout(() => {
          console.log('🔄 Redirecting to CustomerDashboard after registration...');
          console.log('Final auth check before redirect:', {
            access_token: localStorage.getItem('access_token'),
            userId: localStorage.getItem('userId'),
            displayName: localStorage.getItem('displayName')
          });

          // Use window.location.replace to avoid back button issues
          window.location.replace('/CustomerDashboard');
        }, 2500);
        
      } else {
        setError(responseData.message || responseData.detail || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPhoneVerification = () => {
    setOtpSent(false);
    setOtp('');
    setPhoneNumber('');
    setError('');
    setSuccessMessage('');
  };

  if (isAuthChecking) {
    return (
      <>
        <Header />
        <div className="min-h-screen relative flex items-center justify-center p-4">
          <SquaresBackground />
          <div className="absolute inset-0 bg-blue-50 bg-opacity-40" />
          <div className="relative z-10 text-center bg-white rounded-xl p-8 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {isNavigating && <LoadingAnimation fullScreen message="Redirecting to dashboard..." />}
      <div className="min-h-screen relative flex items-center justify-center p-4 py-8">
        <SquaresBackground />
        <div className="absolute inset-0 bg-blue-50 bg-opacity-30" />

      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl border border-blue-100 my-8">
        <div className="p-8">
          {/* Logo */}
          <div className="text-center flex justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/mira-ai.png"
                alt="Mira AI Logo"
                width={150}
                height={12}
               
              />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {!isAuthenticated 
                ? 'Customer Authentication' 
                : 'Complete Your Profile'
              }
            </h1>
            <p className="text-gray-600">
              {!isAuthenticated 
                ? 'Verify your phone number to continue'
                : 'Please fill in your details to complete registration'
              }
            </p>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert
              message="Success"
              description={successMessage}
              type="success"
              showIcon
              className="mb-4"
            />
          )}

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {/* Phone Verification Form */}
          {!isAuthenticated && (
            <div className="space-y-6">
              {!otpSent ? (
                <>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="01XXXXXXXXX"
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your Bangladesh mobile number</p>
                  </div>

                  <Button
                    type="button"
                    onClick={requestOtp}
                    disabled={otpLoading || !phoneNumber.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3"
                  >
                    {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="otp">Enter OTP *</Label>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 4-digit OTP"
                      maxLength={4}
                      className="mt-1 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Check your SMS for the verification code</p>
                  </div>

                  <Button
                    type="button"
                    onClick={verifyOtp}
                    disabled={isLoading || !otp.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      onClick={resetPhoneVerification}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      ← Change phone number
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Registration Form */}
          {isAuthenticated && (
            <form onSubmit={handleRegistrationSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="mt-1 h-9 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="mt-1 h-9 border-blue-200 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-sm">Display Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="How should we call you?"
                  className="mt-1 h-9 border-blue-200 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  // placeholder="your@email.com"
                  className="mt-1 h-9 border-blue-200 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-sm">Address (Optional)</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  className="mt-1 h-9 border-blue-200 focus:border-blue-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CustomerRegistration;