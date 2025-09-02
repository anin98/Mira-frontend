"use client";

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/header';
import Footer from '../components/Footer';

// Local Button component to avoid toast dependency
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
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  billingAddress: string;
  city: string;
  postalCode: string;
  country: string;
}

const Payment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh'
  });

  const plans: Record<string, Plan> = {
    free: { name: 'Free', price: 0, currency: 'USD' },
    standard: { name: 'Standard', price: 49, currency: 'USD' },
    enterprise: { name: 'Enterprise', price: 199, currency: 'USD' }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStripePayment = async () => {
    console.log('Processing Stripe payment...', formData);
    // Stripe integration logic will go here
    alert('Stripe payment processing... (Integration pending)');
  };

  const handleSSLCommerzPayment = async () => {
    console.log('Processing SSLCommerz payment...', formData);
    // SSLCommerz integration logic will go here
    alert('SSLCommerz payment processing... (Integration pending)');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'stripe') {
      handleStripePayment();
    } else {
      handleSSLCommerzPayment();
    }
  };

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
              Secure payment processing with multiple gateway options
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Plan Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Select Plan</Label>
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
                        ${plan.price}{plan.price > 0 ? '/mo' : ''}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Payment Method</Label>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('stripe')}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={paymentMethod === 'stripe' ? {
                      borderColor: '#496C52',
                      backgroundColor: '#f0f7f1'
                    } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <div className="font-medium">Stripe</div>
                          <div className="text-sm text-gray-600">International cards, secure processing</div>
                        </div>
                      </div>
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Global</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('sslcommerz')}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      paymentMethod === 'sslcommerz'
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={paymentMethod === 'sslcommerz' ? {
                      borderColor: '#496C52',
                      backgroundColor: '#f0f7f1'
                    } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-3" style={{ color: '#496C52' }} />
                        <div>
                          <div className="font-medium">SSLCommerz</div>
                          <div className="text-sm text-gray-600">Local payment gateway for Bangladesh</div>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#e6f3e7', color: '#2d3e32' }}>Local</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{plans[selectedPlan].name} Plan</span>
                  <span className="font-medium">${plans[selectedPlan].price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold" style={{ color: '#496C52' }}>
                      ${plans[selectedPlan].price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
              
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

                {paymentMethod === 'stripe' && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          type="text"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="text"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        type="text"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    id="billingAddress"
                    name="billingAddress"
                    type="text"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dhaka"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="1000"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full text-white font-medium py-3 flex items-center justify-center transition-all duration-200"
                  style={{ background: 'linear-gradient(to right, #496C52, #3a5441)' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #3a5441, #2d3e32)'}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #496C52, #3a5441)'}
                  disabled={plans[selectedPlan].price === 0}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {plans[selectedPlan].price === 0 
                    ? 'Start Free Plan' 
                    : `Pay $${plans[selectedPlan].price} with ${paymentMethod === 'stripe' ? 'Stripe' : 'SSLCommerz'}`
                  }
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