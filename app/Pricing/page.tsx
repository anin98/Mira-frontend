'use client';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import Footer from '../components/Footer';

interface PlanFeature {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  buttonText: string;
  popular: boolean;
  color: string;
  planKey: string; // Add plan key for navigation
}

const Pricing: React.FC = () => {
  const router = useRouter();

  const plans: PlanFeature[] = [
    {
      name: 'Free',
      price: '৳0',
      period: '/month',
      description: 'Perfect for getting started with basic sales automation',
      features: [
        'Up to 5 orders',
        '14 days trial period',
        'Maximum 5 products',
        'Customizable options using selected premade sales agent templates',
        'Basic email support'
      ],
      limitations: [
        'Limited order capacity',
        'Limited product range',
        'Basic templates only',
        'No custom sales agent'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      color: 'border-gray-200',
      planKey: 'free'
    },
    {
      name: 'Standard',
      price: '৳2,500',
      originalPrice: '৳10,000',
      period: '/month',
      description: 'Ideal for growing businesses that need advanced sales automation',
      features: [
        'Unlimited orders',
        'Up to 50 products',
        'Unlimited lead generation',
        'Identify potential customers',
        'Completely customized Sales Agent',
        'Advanced AI scoring',
        'Priority email & chat support',
        'CRM integrations'
      ],
      limitations: [
        'Limited to 50 products',
        'Standard support response time'
      ],
      buttonText: 'Start Standard Plan',
      popular: true,
      color: 'border-green-500',
      planKey: 'standard'
    },
    {
      name: 'Enterprise',
      price: '৳10,000',
      originalPrice: '৳20,000',
      period: '/month',
      description: 'For large organizations requiring maximum scale and features',
      features: [
        'Unlimited orders',
        'Unlimited products',
        'Unlimited lead generation',
        'Identify potential customers',
        'Completely customized Sales Agent',
        'Advanced Sales Analytics',
        'Priority support if server gets overloaded',
        'Dedicated Customer support',
        'Multi-team collaboration',
        'Custom API access',
        'White-label options'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      popular: false,
      color: 'border-purple-500',
      planKey: 'enterprise'
    }
  ];

  const handlePlanSelect = (plan: PlanFeature) => {
    if (plan.planKey === 'enterprise') {
      // For enterprise, redirect to Calendly for custom consultation
      window.open('https://calendly.com/anindita-grayscale-technologies/30min', '_blank');
    } else {
      // For Free and Standard plans, navigate to payment page with plan parameter
      router.push(`/Payment?plan=${plan.planKey}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your <span style={{ color: '#496C52' }}>Perfect Plan</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Scale your sales with AI-powered automation and lead generation. Start free and upgrade as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${plan.color} ${
                  plan.popular ? 'scale-105 ring-4 ring-green-200' : ''
                } transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span 
                      className="text-white px-4 py-2 rounded-full text-sm font-medium"
                      style={{ background: 'linear-gradient(to right, #496C52, #3a5441)' }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Discount Badge for Standard and Enterprise */}
                {plan.originalPrice && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {plan.name === 'Standard' ? '75% OFF' : '50% OFF'}
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.originalPrice && (
                        <div className="text-lg text-gray-500 line-through mb-1">
                          {plan.originalPrice}{plan.period}
                        </div>
                      )}
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" style={{ color: '#496C52' }} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-start">
                        <X className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full text-white font-medium py-3 transition-all duration-200 ${
                      plan.popular ? '' : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    style={plan.popular ? { 
                      background: 'linear-gradient(to right, #496C52, #3a5441)' 
                    } : {}}
                    onMouseEnter={plan.popular ? (e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #3a5441, #2d3e32)' : undefined}
                    onMouseLeave={plan.popular ? (e: React.MouseEvent<HTMLButtonElement>) => (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #496C52, #3a5441)' : undefined}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">
              Need a custom solution? Our team can help you find the perfect fit for your business.
            </p>
            <a 
              href="https://calendly.com/anindita-grayscale-technologies/30min" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                className="font-medium transition-all duration-200"
                style={{ borderColor: '#496C52', color: '#496C52' }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#f0f7f1';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                Schedule a Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;