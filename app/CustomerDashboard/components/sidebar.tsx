// components/Dashboard/Sidebar.tsx
'use client';
import { useState, useEffect } from 'react';
import { Badge } from 'antd';
import {
  MessageCircle,
  Package,
  Settings,
  User,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  onNavigate: (route: string) => void;
  activeComponent: string;
  onCollapse?: (isCollapsed: boolean) => void;
  isLoggingOut?: boolean;
}

interface NavigationItem {
  title: string;
  route: string;
  icon: LucideIcon;
  description: string;
  badge?: number;
}

export default function DashboardSidebar({ 
  onNavigate, 
  activeComponent, 
  onCollapse,
  isLoggingOut = false 
}: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string>(activeComponent || 'welcome');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (activeComponent) {
      setActiveItem(activeComponent);
    }
  }, [activeComponent]);

  // This would typically come from an API call
  useEffect(() => {
    // Simulate API call to get unread messages count
    const fetchUnreadCount = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/conversations/unread-count');
        // const data = await response.json();
        // setUnreadCount(data.count);
        
        // Mock data for now
        setUnreadCount(3);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
  }, []);

  const handleItemClick = (route: string) => {
    setActiveItem(route);
    onNavigate(route);
    
    // Auto-collapse sidebar when navigation item is clicked (especially for conversations)
    if (route === 'conversations' || window.innerWidth < 1024) {
      setIsCollapsed(true);
      onCollapse?.(true);
    }
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapse?.(newCollapsedState);
  };

  const navigationItems: NavigationItem[] = [
    {
      title: 'Conversations',
      route: 'conversations',
      icon: MessageCircle,
      description: 'Manage customer conversations',
      badge: unreadCount
    },
    {
      title: 'Orders',
      route: 'orders',
      icon: Package,
      description: 'View and manage orders'
    },
    {
      title: 'Settings',
      route: 'settings',
      icon: Settings,
      description: 'Account and system settings'
    }
  ];

  if (isLoggingOut) {
    return null;
  }

  const renderNavigationItem = (item: NavigationItem) => (
    <div
      key={item.route}
      onClick={() => handleItemClick(item.route)}
      onMouseEnter={() => setHoveredItem(item.route)}
      onMouseLeave={() => setHoveredItem(null)}
      className={`group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
        activeItem === item.route
          ? 'bg-blue-50 text-blue-700 shadow-sm'
          : hoveredItem === item.route
          ? 'bg-gray-100 text-gray-700'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
      style={{
        boxShadow: activeItem === item.route ? 'inset 4px 0 0 0 #2563eb' : 'none'
      }}
    >
      <div className={`flex-shrink-0 relative ${
        activeItem === item.route ? 'text-blue-600' : 'text-gray-500'
      }`}>
        {item.badge && item.badge > 0 ? (
          <Badge count={item.badge} size="small">
            <item.icon size={18} />
          </Badge>
        ) : (
          <item.icon size={18} />
        )}
      </div>
      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium truncate ${
              activeItem === item.route ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {item.title}
            </div>
            <div className="text-xs text-gray-500 truncate mt-0.5">
              {item.description}
            </div>
          </div>
          {activeItem === item.route && (
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div 
      className={`bg-white border-r border-gray-200 flex flex-col overflow-hidden mt-2 mb-8 rounded-md transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ 
        height: 'calc(100vh - 80px)',
        marginBottom: '80px'
      }}
    >
      {/* Header with integrated hamburger menu */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your account</p>
          </div>
        )}
        
        {/* Hamburger Menu Button - integrated in header */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </button>
      </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 overflow-x-hidden">
          <div className="space-y-2">
            {navigationItems.map(renderNavigationItem)}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@example.com</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          )}
        </div>


      {!isCollapsed && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {
            setIsCollapsed(true);
            onCollapse?.(true);
          }}
        />
      )}
    </div>
  );
}