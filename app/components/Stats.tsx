const Stats = () => {
    const stats = [
      { number: '500+', label: 'Active Companies', description: 'Trust our platform' },
      { number: '2M+', label: 'Leads Generated', description: 'Every month' },
      { number: '85%', label: 'Success Rate', description: 'Conversion boost' },
      { number: '24/7', label: 'AI Support', description: 'Always available' },
    ];
  
    return (
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of companies that have transformed their sales process with MIRA AI
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Stats;