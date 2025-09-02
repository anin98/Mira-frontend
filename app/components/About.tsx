import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const About = () => {
  const benefits = [
    'Turn each conversation into a potential sales lead',
    'Reduce customer reply latency by upto 98%',
    'Increase customer satisfaction by 80%',
    'Get actionable insights in real-time',
    
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Revolutionizing Sales with 
                <span className="text-blue-600"> Artificial Intelligence</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                MIRA AI combines cutting-edge machine learning with intuitive design to create the most powerful sales platform on the market. We help businesses of all sizes scale their sales operations and achieve remarkable growth.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-3xl p-8 shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">Up to 50%</div>
                    <div className="text-sm text-gray-600">Revenue Uplift </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">30%</div>
                    <div className="text-sm text-gray-600">Increase in Conversion Rates</div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">10+ Hrs</div>
                    <div className="text-sm text-gray-600">Saved Daily per Sales Rep</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-2xl font-bold text-red-400">20%</div>
                    <div className="text-sm text-gray-600">Increase in Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;