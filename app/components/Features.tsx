
import { Bot, CreditCard, TrendingUp, SquarePen, TruckIcon, BarChart3 } from 'lucide-react';


const Features = () => {
  const features = [
    {
      icon: Bot,
      title: 'Automated Orders',
      description: 'Streamline your operations by automatically placing orders based on preset inventory levels or customer subscriptions, ensuring you never miss a sale.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: CreditCard,
      title: 'Payment Integration',
      description: 'Securely accept and process payments from various methods directly within your platform for a seamless and trustworthy customer checkout experience.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Sales Lead Generation',
      description: 'Actively identify and capture potential customers who have shown interest in your products or services, fueling your sales pipeline.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: SquarePen,
      title: 'Fully Customizable',
      description: 'Tailor every aspect of the platform, from branding to features, to perfectly align with your unique business needs and create a distinct online presence.',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: TruckIcon,
      title: 'Easy Order Tracking',
      description: 'Provide customers with real-time updates on their order status from purchase to delivery, enhancing transparency and satisfaction',
      color: 'bg-red-100 text-red-600'
    },
    {
      icon: BarChart3,
      title: 'AI Powered Analytics',
      description: 'Leverage artificial intelligence to gain deep insights from your business data, enabling smarter decisions and predicting future sales trends.',
      color: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-blue-600">Scale Sales</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our AI-powered agent is designed to automate your entire sales, order, and payment integration processes, allowing your business to simply integrate it and then let us handle the complete order fulfillment. You'll maintain full visibility with comprehensive order tracking, and our AI agent will even finalize payments, ensuring a seamless and efficient journey from sale to completion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group-hover:scale-105">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;