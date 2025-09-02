import React, { useState, useRef } from 'react';
import { Mail, Phone, Globe, Send, Check } from 'lucide-react';

// Simple Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "lg";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  type = "button", 
  size = "default", 
  disabled = false, 
  ...props 
}) => {
  const sizeClasses = {
    default: "px-4 py-2",
    lg: "px-6 py-3"
  };
  
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Input component with forwardRef
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// Simple Textarea component with forwardRef
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Create refs for form inputs
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get in touch via email',
      contact: 'contact@grayscale-technologies.com',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team',
      contact: '+88 01768244283',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Globe,
      title: 'Visit Us',
      description: 'Our Website',
      contact: 'https://grayscale-technologies.com',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Handle form submission with Formspree
  const handleFormSubmit = async () => {
    // Get form values using refs
    const firstName = firstNameRef.current?.value || '';
    const lastName = lastNameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const company = companyRef.current?.value || '';
    const message = messageRef.current?.value || '';

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // Create form data
    const formData = new FormData();
    formData.append('_subject', 'New contact from MIRA AI website');
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('company', company);
    formData.append('message', message);

    try {
      const response = await fetch("https://formspree.io/f/mrbpayen", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Clear form using refs
        if (firstNameRef.current) firstNameRef.current.value = '';
        if (lastNameRef.current) lastNameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (companyRef.current) companyRef.current.value = '';
        if (messageRef.current) messageRef.current.value = '';
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        const data = await response.json();
        setFormError(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to <span className="text-blue-600">Scale Your Sales?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your journey with MIRA AI today. Our team is here to help you transform your sales process.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => {
            let href = '';
            let target = '_self';
            
            if (info.title === 'Email Us') {
              href = `mailto:${info.contact}`;
            } else if (info.title === 'Call Us') {
              href = `tel:${info.contact}`;
            } else if (info.title === 'Visit Us') {
              href = info.contact;
              target = '_blank';
            }
            
            return (
              <div key={index} className="text-center group">
                <a 
                  href={href}
                  target={target}
                  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="block bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-2xl ${info.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-600 mb-3">{info.description}</p>
                  <p className="text-blue-600 font-semibold">{info.contact}</p>
                </a>
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 rounded-full">
                  <Check className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  We appreciate you reaching out to us. We'll get back to you shortly.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send us a message</h3>
                
                {formError && (
                  <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {formError}
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input 
                        ref={firstNameRef}
                        placeholder="John" 
                        className="h-12" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input 
                        ref={lastNameRef}
                        placeholder="Doe" 
                        className="h-12" 
                        required 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input 
                      ref={emailRef}
                      type="email" 
                      placeholder="john@company.com" 
                      className="h-12" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Input 
                      ref={companyRef}
                      placeholder="Your Company" 
                      className="h-12" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea 
                      ref={messageRef}
                      placeholder="Tell us about your sales challenges..." 
                      className="min-h-32" 
                      required 
                    />
                  </div>
                  <Button 
                    onClick={handleFormSubmit}
                    size="lg" 
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-12 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;