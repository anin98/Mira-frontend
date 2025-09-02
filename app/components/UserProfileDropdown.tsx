'use client';
import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

interface UserProfileDropdownProps {
  className?: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ className = '' }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem('access_token');
    const verifiedPhone = localStorage.getItem('verifiedPhone');
    
    if (accessToken && verifiedPhone) {
      setIsLoggedIn(true);
      
      // Try to get user name from localStorage (if stored during registration)
      const storedFirstName = localStorage.getItem('firstName') || '';
      const storedLastName = localStorage.getItem('lastName') || '';
      const storedDisplayName = localStorage.getItem('displayName') || '';
      
      let displayName = '';
      let initials = '';
      
      if (storedDisplayName) {
        displayName = storedDisplayName;
        initials = storedDisplayName.charAt(0).toUpperCase();
      } else if (storedFirstName || storedLastName) {
        displayName = `${storedFirstName} ${storedLastName}`.trim();
        initials = `${storedFirstName.charAt(0)}${storedLastName.charAt(0)}`.toUpperCase();
      } else {
        // Fallback to phone number if no name available
        displayName = verifiedPhone;
        initials = 'U'; // Default to 'U' for User
      }
      
      setUserName(displayName);
      setUserInitials(initials);
    }
  }, []);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    
    // Alternatively, you can clear specific items:
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('refreshToken');
    // localStorage.removeItem('verifiedPhone');
    // localStorage.removeItem('userId');
    // localStorage.removeItem('customerId');
    // localStorage.removeItem('firstName');
    // localStorage.removeItem('lastName');
    // localStorage.removeItem('displayName');
    
    // Update state
    setIsLoggedIn(false);
    setUserName('');
    setUserInitials('');
    
    // Redirect to home or auth page
    router.push('/auth');
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  // Don't render anything if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={className}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['click']}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-full p-1 transition-colors">
          <Avatar
            size={40}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            icon={!userInitials ? <UserOutlined /> : null}
          >
            {userInitials}
          </Avatar>
          <span className="ml-2 text-gray-700 font-medium hidden sm:block max-w-32 truncate">
            {userName}
          </span>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserProfileDropdown;