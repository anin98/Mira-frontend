'use client';
import React, { useState } from 'react';
import {
  DashboardOutlined,
  ShoppingOutlined,
  BuildOutlined,
  MessageOutlined,
  RobotOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';

interface SidebarProps {
  className?: string;
  onNavigate: (view: string) => void;
  activeComponent: string;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  route: string;
  description?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  className = '', 
  onNavigate, 
  activeComponent 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: 'Sales Dashboard',
      icon: <DashboardOutlined className="text-lg" />,
      route: 'dashboard',
      description: 'View sales metrics and analytics'
    },
    {
      key: 'products',
      label: 'Manage Products',
      icon: <ShoppingOutlined className="text-lg" />,
      route: 'products',
      description: 'Add and manage your products'
    },
    {
      key: 'company',
      label: 'Manage Company',
      icon: <BuildOutlined className="text-lg" />,
      route: 'company',
      description: 'Configure company settings'
    },
    {
      key: 'conversations',
      label: 'Manage Mira Conversation',
      icon: <MessageOutlined className="text-lg" />,
      route: 'conversations',
      description: 'View customer conversations'
    },
    {
      key: 'ai-persona',
      label: 'Manage AI Persona',
      icon: <RobotOutlined className="text-lg" />,
      route: 'ai-persona',
      description: 'Configure AI behavior'
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const handleItemClick = (route: string) => {
    onNavigate(route);
    closeMobileSidebar();
  };

  const isActive = (route: string) => {
    return activeComponent === route;
  };

  const renderNavigationItem = (item: MenuItem) => (
    <div
      key={item.route}
      onClick={() => handleItemClick(item.route)}
      onMouseEnter={() => setHoveredItem(item.route)}
      onMouseLeave={() => setHoveredItem(null)}
      className={`group flex items-center gap-3 px-3 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive(item.route)
          ? 'bg-blue-50 text-blue-700 shadow-sm'
          : hoveredItem === item.route
          ? 'bg-gray-100 text-gray-700'
          : 'text-gray-600 hover:bg-gray-50'
      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
      style={{
        boxShadow: isActive(item.route) ? 'inset 4px 0 0 0 #2563eb' : 'none'
      }}
    >
      <div className={`flex-shrink-0 ${
        isActive(item.route) ? 'text-blue-600' : 'text-gray-500'
      }`}>
        {item.icon}
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium truncate ${
            isActive(item.route) ? 'text-blue-700' : 'text-gray-700'
          }`}>
            {item.label}
          </div>
          {item.description && (
            <div className="text-xs text-gray-500 truncate mt-0.5">
              {item.description}
            </div>
          )}
        </div>
      )}
      
      {!isCollapsed && isActive(item.route) && (
        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        <MenuOutlined className="text-lg text-gray-600" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm z-50 transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          )}
          
          {/* Desktop Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuOutlined className="text-gray-600" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <CloseOutlined className="text-gray-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="py-6 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map(renderNavigationItem)}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              Mira AI Dashboard
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Spacer */}
      <div
        className={`
          hidden lg:block transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      />
    </>
  );
};

export default Sidebar;