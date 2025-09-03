"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Shield, Zap, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../components/header';
import Footer from '../components/Footer';

// Types for API integration
interface PaymentGateway {
  id: number;
  name: string;
  gateway_type: string;
  description: string;
}

interface CompanyPaymentMethod {
  id: number;
  gateway: PaymentGateway;
  gateway_id: number;
  credentials: {
    qr_code_url?: string;
    webhook_url?: string;
    [key: string]: any;
  };
  is_active: boolean;
  updated_at: string;
}

interface OrderItem {
  variant_id: number;
  quantity: number;
}

interface OrderData {
  customer_id?: number;
  guest_name?: string;
  guest_phone?: string;
  guest_address?: string;
  items: OrderItem[];
  delivery_location: 'inside_dhaka' | 'outside_dhaka';
}

// Local Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
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
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
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

// Local Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Local Label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, className = "", ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

interface Plan {
  name: string;
  price: number;
  currency: string;
}

interface FormData {
  email: string;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  delivery_location: 'inside_dhaka' | 'outside_dhaka';
}

const Payment: React.FC = () => {
  const searchParams = useSearchParams();
  const selectedPlanFromUrl = searchParams?.get('plan') || 'standard';
  
  const [selectedPlan, setSelectedPlan] = useState<string>(selectedPlanFromUrl);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [companyPaymentMethods, setCompanyPaymentMethods] = useState<CompanyPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<CompanyPaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    guest_name: '',
    guest_phone: '',
    guest_address: '',
    delivery_location: 'inside_dhaka'
  });

  // Plan prices from your pricing component
  const plans: Record<string, Plan> = {
    free: { name: 'Free', price: 0, currency: 'BDT' },
    standard: { name: 'Standard', price: 2500, currency: 'BDT' },
    enterprise: { name: 'Enterprise', price: 10000, currency: 'BDT' }
  };

  // API Base URL
  const API_BASE = 'https://api.grayscale-technologies.com/api';

  // Get auth token (if user is logged in)
  const getAuthToken = () => localStorage.getItem('access_token');

  // Get auth headers
  const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Fetch available payment gateways
  const fetchPaymentGateways = async () => {
    try {
      const response = await fetch(`${API_BASE}/payments/gateways/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment gateways');
      }

      const data = await response.json();
      setPaymentGateways(data);
    } catch (err) {
      console.error('Error fetching payment gateways:', err);
      setError('Failed to load payment methods');
    }
  };

  // Fetch company payment methods
  const fetchCompanyPaymentMethods = async () => {
    try {
      const response = await fetch(`${API_BASE}/payments/methods/`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      const data = await response.json();
      setCompanyPaymentMethods(data);
      
      // Set the first active payment method as default
      const activeMethod = data.find((method: CompanyPaymentMethod) => method.is_active);
      if (activeMethod) {
        setSelectedPaymentMethod(activeMethod);
      }
    } catch (err) {
      console.error('Error fetching company payment methods:', err);
      setError('Failed to load payment configuration');
    }
  };

  // Initiate MFS payment
  const initiateMFSPayment = async () => {
    if (!selectedPaymentMethod || plans[selectedPlan].price === 0) {
      if (plans[selectedPlan].price === 0) {
        setSuccess('Free plan activated successfully!');
        return;
      }
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create order data for the subscription plan
      const orderData: OrderData = {
        guest_name: formData.guest_name,
        guest_phone: formData.guest_phone,
        guest_address: formData.guest_address,
        delivery_location: formData.delivery_location,
        items: [
          {
            variant_id: 1, // This should be the actual plan variant ID from your products
            quantity: 1
          }
        ]
      };

      const response = await fetch(`${API_BASE}/payments/initiate-mfs-payment/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Payment initiation failed (${response.status})`);
      }

      const result = await response.json();
      
      // Handle successful payment initiation
      setSuccess('Payment initiated successfully! Please complete the payment using the provided method.');
      console.log('Payment initiated:', result);
      
      // You might want to redirect to a payment confirmation page
      // or show QR code if it's an MFS payment
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initiateMFSPayment();
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    fetchPaymentGateways();
    fetchCompanyPaymentMethods();
  }, []);

  useEffect(() => {
    if (searchParams) {
      const planFromUrl = searchParams.get('plan');
      if (planFromUrl && plans[planFromUrl]) {
        setSelectedPlan(planFromUrl);
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              href="/Pricing" 
              className="inline-flex items-center mb-4 transition-colors duration-200"
              style={{ color: '#496C52' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLAnchorElement).style.color = '#3a5441'}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.target as HTMLAnchorElement).style.color = '#496C52'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pricing
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your <span style={{ color: '#496C52' }}>Payment</span>
            </h1>
            <p className="text-gray-600">
              Secure payment processing with local and international options
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-600">{success}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600">{error}</p>
                <button 
                  onClick={clearMessages}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Plan Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Selected Plan</Label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedPlan === key
                          ? 'text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={selectedPlan === key ? {
                        borderColor: '#496C52',
                        backgroundColor: '#496C52'
                      } : {}}
                      onMouseEnter={selectedPlan !== key ? (e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.borderColor = '#6b8e74' : undefined}
                      onMouseLeave={selectedPlan !== key ? (e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.borderColor = '#d1d5db' : undefined}
                    >
                      <div className="font-medium">{plan.name}</div>
                      <div className={`text-sm ${selectedPlan === key ? 'text-blue-100' : 'text-gray-600'}`}>
                        ৳{plan.price}{plan.price > 0 ? '/mo' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</Label>
                <div className="space-y-3">
                  {companyPaymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={selectedPaymentMethod?.id === method.id ? {
                        borderColor: '#496C52',
                        backgroundColor: '#f0f7f1'
                      } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {method.gateway.gateway_type === 'MFS_QR_CODE' ? (
                            <Smartphone className="h-5 w-5 text-green-600 mr-3" />
                          ) : (
                            <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                          )}
                          <div>
                            <div className="font-medium">{method.gateway.name}</div>
                            <div className="text-sm text-gray-600">{method.gateway.description}</div>
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {method.gateway.gateway_type === 'MFS_QR_CODE' ? 'Local' : 'Global'}
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Fallback if no payment methods configured */}
                  {companyPaymentMethods.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No payment methods configured. Please contact support.
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{plans[selectedPlan].name} Plan</span>
                  <span className="font-medium">৳{plans[selectedPlan].price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">৳0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold" style={{ color: '#496C52' }}>
                      ৳{plans[selectedPlan].price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="guest_name">Full Name</Label>
                  <Input
                    id="guest_name"
                    name="guest_name"
                    type="text"
                    value={formData.guest_name}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="guest_phone">Phone Number</Label>
                  <Input
                    id="guest_phone"
                    name="guest_phone"
                    type="tel"
                    value={formData.guest_phone}
                    onChange={handleInputChange}
                    placeholder="+880 1234 567890"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="guest_address">Address</Label>
                  <Input
                    id="guest_address"
                    name="guest_address"
                    type="text"
                    value={formData.guest_address}
                    onChange={handleInputChange}
                    placeholder="Your full address"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="delivery_location">Location</Label>
                  <select
                    id="delivery_location"
                    name="delivery_location"
                    value={formData.delivery_location}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    required
                  >
                    <option value="inside_dhaka">Inside Dhaka</option>
                    <option value="outside_dhaka">Outside Dhaka</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white font-medium py-3 flex items-center justify-center transition-all duration-200"
                  style={{ background: 'linear-gradient(to right, #496C52, #3a5441)' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #3a5441, #2d3e32)'}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #496C52, #3a5441)'}
                  disabled={loading || plans[selectedPlan].price === 0}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      {plans[selectedPlan].price === 0 
                        ? 'Start Free Plan' 
                        : `Pay ৳${plans[selectedPlan].price} with ${selectedPaymentMethod?.gateway.name || 'Selected Method'}`
                      }
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p className="flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;