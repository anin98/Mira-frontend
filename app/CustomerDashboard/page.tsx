'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/header';
import DashboardSidebar from './components/sidebar';
import ConversationsPage from './components/conversations';

import React from 'react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState<string>('welcome');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam) {
      console.log('URL view parameter detected:', viewParam);
      setActiveView(viewParam);
    }

    const handleNavigateToDashboard = (event: CustomEvent) => {
      console.log('Dashboard navigation event received:', event.detail);
      setActiveView(event.detail.view || 'conversations');
    };

    window.addEventListener('navigateToDashboard', handleNavigateToDashboard as EventListener);
    return () => {
      window.removeEventListener('navigateToDashboard', handleNavigateToDashboard as EventListener);
    };
  }, [searchParams]);

  const handleLogoutStateChange = (loggingOut: boolean) => {
    setIsLoggingOut(loggingOut);
  };

  const handleNavigate = (view: string) => {
    console.log('Dashboard Layout received navigation request to:', view);
    setActiveView(view);
  };

  const handleSidebarCollapse = (isCollapsed: boolean) => {
    setSidebarCollapsed(isCollapsed);
    console.log('Dashboard Layout detected sidebar collapse:', isCollapsed);
  };

//   if (isLoading) {
//     return <DashboardSkeletonLoader />;
//   }

  const renderContent = () => {
    console.log('Rendering content for activeView:', activeView);
    
    if (activeView === 'welcome') {
      return (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="text-center px-6 max-w-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Dashboard
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to your dashboard. Use the sidebar to navigate through
                conversations, orders, and settings to manage your account.
              </p>
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'conversations':
        return <ConversationsPage />;
    //   case 'orders':
    //     return <OrdersPage />;
    //   case 'settings':
    //     return <SettingsPage />;
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">Page Not Found</h3>
              <p className="text-gray-500">The requested page could not be found.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      style={{ height: 'calc(100vh)' }} 
      className="overflow-hidden bg-[#f0f2f5] flex flex-col"
    >
      {/* Header */}
      <Header
       
      />
      
      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className={`flex-shrink-0 relative z-40 transition-all duration-300 ${sidebarCollapsed ? 'ml-2' : 'ml-2'}`}>
          <DashboardSidebar
            onNavigate={handleNavigate}
            activeComponent={activeView}
            onCollapse={handleSidebarCollapse}
            isLoggingOut={isLoggingOut}
          />
        </div>
        
        {/* Main Content */}
        <main className={`flex-1 bg-[#f0f2f5] overflow-hidden min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-2' : 'ml-0'}`}>
          <div className="h-full">
            {renderContent()}
          </div>
        </main>
      </div>

      <style jsx global>{`
        /* Ensure proper scrolling on all screen sizes */
        * {
          box-sizing: border-box;
        }
        html, body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}