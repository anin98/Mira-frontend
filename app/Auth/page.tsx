'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Alert } from 'antd';
import { Button } from "../components/ui/button";
import {Input} from "../components/ui/input"
import {Label} from "../components/ui/label"

const Auth: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const validateBDPhone = (phone: string): boolean => {
    // BD phone number validation: starts with +880 or 880 or 01, followed by 9 digits
    const bdPhoneRegex = /^(\+880|880|01)[0-9]{9}$/;
    return bdPhoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    // For BD numbers, just return the cleaned number starting with 01
    if (cleaned.startsWith('880')) {
      return cleaned.substring(3); // Remove 880 prefix, return 01xxxxxxxx
    } else if (cleaned.startsWith('01')) {
      return cleaned; // Already in correct format
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '0' + cleaned; // Add missing 0 at the beginning
    }
    return cleaned;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateBDPhone(phoneNumber)) {
      setError('Please enter a valid BD phone number');
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const payload = {
        phone_number: formattedPhone
      };
      
      console.log('Requesting OTP for:', payload); // Debug log
      
      const response = await fetch('https://api.grayscale-technologies.com/api/auth/request-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('OTP request response status:', response.status); // Debug log

      if (response.ok) {
        setStep('otp');
        setCountdown(60);
        setError('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('OTP request error:', errorData); // Debug log
        setError(errorData.message || errorData.detail || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP request network error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const payload = {
        phone_number: formattedPhone,
        otp: otp
      };
      
      console.log('Sending OTP verification:', payload); // Debug log
      
      const response = await fetch('https://api.grayscale-technologies.com/api/auth/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Debug log
        
        // Store tokens, phone number, and user ID
        localStorage.setItem('verifiedPhone', formattedPhone);
        
        if (data.access) {
          localStorage.setItem('access_token', data.access); // Changed from accessToken to access_token
        }
        
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }
        
        // Store user ID
        if (data.id) {
          localStorage.setItem('userId', data.id.toString());
        }
        
        // Show success message
        if (data.message) {
          setSuccessMessage(data.message);
          setError('');
          
       
          setTimeout(() => {
            window.location.href = '/CustomerAuth';
          }, 2000);
        }
        
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData); // Debug log
        setError(errorData.message || errorData.detail || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.grayscale-technologies.com/api/auth/request-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: formatPhoneNumber(phoneNumber) })
      });

      if (response.ok) {
        setCountdown(60);
        setOtp('');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setSuccessMessage('');
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8 flex justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/mira-ai.png"
                alt="Mira AI Logo"
                width={150}
                height={42}
                className="h-12 w-auto mx-auto"
              />
            </Link>
          </div>

          {/* Phone Number Step */}
          {step === 'phone' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Phone Verification
                </h1>
                <p className="text-gray-600">
                  Enter your BD phone number to receive OTP
                </p>
              </div>
              
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 01XXXXXXXXX
                  </p>
                </div>

                {error && (
                  <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}

                {successMessage && (
                  <Alert
                    message="Success"
                    description={successMessage}
                    type="success"
                    showIcon
                    className="mb-4"
                  />
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white font-medium py-3 transition-all duration-200"
                  style={{ background: 'linear-gradient(to right, #EE7468, #e55a4d)' }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            </>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter OTP
                </h1>
                <p className="text-gray-600">
                  We sent a 4-digit code to
                </p>
                <p className="text-gray-900 font-medium">
                  {formatPhoneNumber(phoneNumber)}
                </p>
              </div>
              
              <form onSubmit={handleOtpSubmit} className="space-y-6">
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

                <div>
                  <Label htmlFor="otp">4-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="0000"
                    className="mt-1 text-center text-lg font-mono tracking-widest"
                    maxLength={4}
                    required
                  />
                </div>

                {error && (
                  <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}

                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 4}
                  className="w-full text-white font-medium py-3 transition-all duration-200"
                  style={{ background: 'linear-gradient(to right, #EE7468, #e55a4d)' }}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <div>
                  <button
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                    style={{ color: countdown > 0 ? '#9CA3AF' : '#EE7468' }}
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
                
                <div>
                  <button
                    onClick={handleBackToPhone}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    ← Change phone number
                  </button>
                </div>
              </div>
            </>
          )}

         
        </div>
      </div>
    </div>
  );
};

export default Auth;