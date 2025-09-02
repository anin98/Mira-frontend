
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '/Pricing' },
    
    ],
   
    support: [
      { name: 'Documentation', href: '#docs' },
      { name: 'Contact', href: '#contact' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center">
            <Link href="/">
              <Image
                src="/white-logo.png"
                alt="Mira AI Logo"
                width={150}
                height={42}
                className="h-12 w-auto"
              />
              </Link>
            </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Revolutionizing sales with AI-powered insights and automation. Scale your business like never before.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">contact@grayscale-technologies.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-gray-400">+88 01768244283</span>
              </div>
              
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-blue-500 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-blue-500 transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 MIRA AI. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-blue-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-blue-500 transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-blue-500 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;