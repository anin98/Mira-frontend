"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "../components/ui/button";
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert } from 'antd';
import Squares from './components/Square';

interface CompanyFormData {
  name: string;
  email: string;
  whatsapp_number: string;
  website: string;
  industry: string;
  company_size: string;
  description: string;
  allow_cash_on_delivery: boolean;
  supports_home_delivery: boolean;
  delivery_scope: string;
  delivery_charge_inside_dhaka: number;
  delivery_charge_outside_dhaka: number;
}

// Squares Background Component
const SquaresBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Squares 
        speed={0.3} 
        squareSize={60}
        direction='diagonal'
        borderColor='rgba(0, 48, 73, 0.2)'
        hoverFillColor='rgba(0, 48, 73, 0.08)'
        mode="light"
      />
    </div>
  );
};

// Compact Progress Bar Component
const CompactProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-center items-center mb-3">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-28 h-1.5 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-[#003049]'
                  : i === currentStep - 1
                  ? 'bg-green-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center">Step {currentStep} of {totalSteps}</p>
    </div>
  );
};

const CompactCompanySignup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    email: '',
    whatsapp_number: '',
    website: '',
    industry: '',
    company_size: '',
    description: '',
    allow_cash_on_delivery: true,
    supports_home_delivery: true,
    delivery_scope: 'DHAKA_ONLY',
    delivery_charge_inside_dhaka: 60,
    delivery_charge_outside_dhaka: 120,
  });

  const totalSteps = 3; // Adding user details step

  // Generate username helper
  const generateUsername = (): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `company_${timestamp}_${randomString}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    setError('');
    
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.whatsapp_number) {
          setError('Please fill in all required fields');
          return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }

        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.whatsapp_number.replace(/\s/g, ''))) {
          setError('Please enter a valid Bangladesh WhatsApp number');
          return false;
        }
        break;
        
      case 2:
        // No required validation for step 2
        break;
        
      case 3:
        // Final validation before submission
        break;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('🏢 Starting company registration...');
      
      const accessToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('userId');
      
      if (!accessToken || !userId) {
        setError('You must be logged in to register a company. Please login first.');
        setIsLoading(false);
        return;
      }

      // Get current customer details using the customer ID
      console.log('👤 Fetching customer details for ID:', userId);
      const customerResponse = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${userId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('❌ Customer fetch failed:', customerResponse.status, errorText);
        setError('Failed to get customer information. Please try logging in again.');
        setIsLoading(false);
        return;
      }

      const customerData = await customerResponse.json();
      console.log('✅ Customer data received:', customerData);

      // Generate username if not available
      const generateUsername = () => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `company_${timestamp}_${randomString}`;
      };

      // Prepare the payload according to API schema using customer data
      const payload = {
        user: {
          username: customerData.user?.username || generateUsername(),
          email: customerData.user?.email || customerData.email || formData.email,
          first_name: customerData.user?.first_name || '',
          last_name: customerData.user?.last_name || ''
        },
        name: formData.name.trim(),
        whatsapp_number: formData.whatsapp_number.trim(),
        email: formData.email.trim(),
        website: formData.website?.trim() || '',
        allow_cash_on_delivery: formData.allow_cash_on_delivery,
        supports_home_delivery: formData.supports_home_delivery,
        delivery_scope: formData.delivery_scope,
        delivery_charge_inside_dhaka: parseInt(formData.delivery_charge_inside_dhaka.toString()) || 0,
        delivery_charge_outside_dhaka: parseInt(formData.delivery_charge_outside_dhaka.toString()) || 0,
      };

      console.log('📤 Company registration payload:', payload);

      const response = await fetch('https://api.grayscale-technologies.com/api/v1/companies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('📥 Company registration response:', responseData);

      if (response.ok) {
        console.log('✅ Company registered successfully');
        
        // Store company data for header detection
        const companyData = {
          name: formData.name,
          email: formData.email,
          id: responseData.id || 'temp_id'
        };
        
        localStorage.setItem('company_access_token', accessToken); // Use the existing token
        localStorage.setItem('company_data', JSON.stringify(companyData));
        
        // Trigger events for header update
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));
        
        setSuccessMessage('Company registered successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
          console.log('🔄 Redirecting to company dashboard...');
          window.location.href = '/company/dashboard';
        }, 2000);
        
      } else {
        console.error('❌ Company registration failed:', response.status, responseData);
        setError(responseData.detail || responseData.message || responseData.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Company registration network error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Company Information</h2>
              <p className="text-sm text-gray-600">Basic details about your business</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="name" className="text-sm">Company Name *</Label>
                <Input 
                  id="name" 
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                  className="mt-1 h-9"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="email" className="text-sm">Business Email *</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="company@example.com"
                    className="mt-1 h-9"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp_number" className="text-sm">WhatsApp *</Label>
                  <Input 
                    id="whatsapp_number" 
                    name="whatsapp_number"
                    type="tel" 
                    value={formData.whatsapp_number}
                    onChange={handleInputChange}
                    placeholder="01XXXXXXXXX"
                    className="mt-1 h-9"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website" className="text-sm">Website (Optional)</Label>
                <Input 
                  id="website" 
                  name="website"
                  type="url" 
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourcompany.com"
                  className="mt-1 h-9"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Business Details</h2>
              <p className="text-sm text-gray-600">Tell us more about your business</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="industry" className="text-sm">Industry</Label>
                  <Select onValueChange={(value) => handleSelectChange('industry', value)}>
                    <SelectTrigger className="mt-1 h-9">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="company_size" className="text-sm">Company Size</Label>
                  <Select onValueChange={(value) => handleSelectChange('company_size', value)}>
                    <SelectTrigger className="mt-1 h-9">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="200+">200+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm">Business Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of your business..."
                  className="mt-1 h-20 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Delivery & Payment</h2>
              <p className="text-sm text-gray-600">Configure your delivery options</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-sm text-gray-900">Payment Options</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Accept Cash on Delivery</span>
                  <input
                    type="checkbox"
                    id="allow_cash_on_delivery"
                    name="allow_cash_on_delivery"
                    checked={formData.allow_cash_on_delivery}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 h-4 w-4 text-green-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Offer Home Delivery</span>
                  <input
                    type="checkbox"
                    id="supports_home_delivery"
                    name="supports_home_delivery"
                    checked={formData.supports_home_delivery}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 h-4 w-4 text-green-600"
                  />
                </div>
              </div>

              {formData.supports_home_delivery && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-sm text-gray-900">Delivery Configuration</h4>
                  
                  <div>
                    <Label htmlFor="delivery_scope" className="text-sm">Delivery Coverage</Label>
                    <Select 
                      value={formData.delivery_scope}
                      onValueChange={(value) => handleSelectChange('delivery_scope', value)}
                    >
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DHAKA_ONLY">Dhaka Only</SelectItem>
                        <SelectItem value="NATIONWIDE">Nationwide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="delivery_charge_inside_dhaka" className="text-sm">Inside Dhaka (৳)</Label>
                      <Input 
                        id="delivery_charge_inside_dhaka" 
                        name="delivery_charge_inside_dhaka"
                        type="number" 
                        value={formData.delivery_charge_inside_dhaka}
                        onChange={handleInputChange}
                        className="mt-1 h-9"
                        min="0"
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delivery_charge_outside_dhaka" className="text-sm">Outside Dhaka (৳)</Label>
                      <Input 
                        id="delivery_charge_outside_dhaka" 
                        name="delivery_charge_outside_dhaka"
                        type="number" 
                        value={formData.delivery_charge_outside_dhaka}
                        onChange={handleInputChange}
                        className="mt-1 h-9"
                        min="0"
                        placeholder="120"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <SquaresBackground />
      <div className="absolute inset-0 bg-white bg-opacity-20" />
      
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200">
        <div className="p-6">
          {/* Logo */}
          <div className="text-center mb-4">
            <Link href="/" className="inline-block">
              <Image
                src="/mira-ai.png"
                alt="Mira AI Logo"
                width={100}
                height={30}
                className="h-8 w-auto mx-auto"
              />
            </Link>
          </div>

          {/* Compact Progress Bar */}
          <CompactProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          {/* Alert Messages */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-4 text-sm"
            />
          )}

          {successMessage && (
            <Alert
              message={successMessage}
              type="success"
              showIcon
              className="mb-4 text-sm"
            />
          )}

          {/* Step Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 gap-3">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex-1 h-10"
              >
                Back
              </Button>
            ) : (
              <div className="flex-1"></div>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex-1 h-10 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 h-10 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-4 text-center space-y-1">
            <p className="text-xs text-gray-600">
              Need help?{' '}
              <Link href="/support" className="text-slate-700 hover:underline">
                Contact Support
              </Link>
            </p>
            <Link href="/CustomerAuth" className="block text-xs text-gray-500 hover:text-gray-700">
              Customer login instead?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactCompanySignup;