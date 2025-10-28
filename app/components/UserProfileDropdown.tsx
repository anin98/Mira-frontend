'use client';
import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

interface UserData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  userId: string;
}

interface UserProfileDropdownProps {
  userData?: UserData;
  className?: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ userData, className = '' }) => {
  const [userInitials, setUserInitials] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      // Use userData prop if provided
      const displayName = userData.displayName || `${userData.firstName} ${userData.lastName}`.trim();
      const initials = userData.displayName
        ? userData.displayName.charAt(0).toUpperCase()
        : `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();

      setUserName(displayName);
      setUserInitials(initials);
    } else {
      // Fallback to localStorage data
      const storedFirstName = localStorage.getItem('firstName') || '';
      const storedLastName = localStorage.getItem('lastName') || '';
      const storedDisplayName = localStorage.getItem('displayName') || '';
      const verifiedPhone = localStorage.getItem('verifiedPhone') || '';

      let displayName = '';
      let initials = '';

      if (storedDisplayName) {
        displayName = storedDisplayName;
        initials = storedDisplayName.charAt(0).toUpperCase();
      } else if (storedFirstName || storedLastName) {
        displayName = `${storedFirstName} ${storedLastName}`.trim();
        initials = `${storedFirstName.charAt(0)}${storedLastName.charAt(0)}`.toUpperCase();
      } else {
        displayName = verifiedPhone || 'User';
        initials = 'U';
      }

      setUserName(displayName);
      setUserInitials(initials);
    }
  }, [userData]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'dashboard':
        router.push('/CustomerDashboard');
        break;
      case 'profile':
        router.push('/Profile');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('displayName');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('customerId');
    localStorage.removeItem('verifiedPhone');
    localStorage.removeItem('refreshToken');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('loginStatusChanged'));
    
    // Redirect to home page
    window.location.href = '/';
  };

  const menuItems = [
    {
      key: 'user-info',
      label: (
        <div className="px-2 py-1 border-b border-gray-200">
          <div className="font-medium text-gray-900">
            {userName || 'User'}
          </div>
          <div className="text-sm text-gray-500">
            {userData?.email || localStorage.getItem('email') || 'user@example.com'}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'dashboard',
      label: 'Manage my profile',
      icon: <UserOutlined />,
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