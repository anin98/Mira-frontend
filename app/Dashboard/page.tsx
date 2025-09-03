'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/header';
import Sidebar from './sidebar';
import ManageSales from './ManageSales';
import ManageProducts from './ManageProducts';
import ManageCompany from './ManageCompany';
import ManageAIPersona from './ManageAi';
import ManageConversations from './ManageConversation';



export default function DashboardPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const searchParams = useSearchParams();

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam) {
      setActiveView(viewParam);
    }
  }, [searchParams]);

  const handleNavigate = (view:string) => {
    console.log('Dashboard received navigation request to:', view);
    setActiveView(view);
  };

  const renderContent = () => {
    console.log('Rendering content for activeView:', activeView);
    
    switch (activeView) {
      case 'dashboard':
        return <ManageSales />;
      case 'products':
        return <ManageProducts />;
      case 'company':
        return <ManageCompany />;
      case 'conversations':
        return <ManageConversations />;
      case 'ai-persona':
        return <ManageAIPersona />;
      default:
        return <ManageSales />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Layout Container */}
      <div 
        className="flex flex-1 overflow-hidden"
    
      >
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar
            onNavigate={handleNavigate}
            activeComponent={activeView}
          />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}