'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import UserProfileDropdown from './UserProfileDropdown';
import { useNavigationContext } from '../contexts/NavigationContext';

interface CompanyData {
  name: string;
  email: string;
  id?: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  userId: string;
}

// Company Header Component
const CompanyHeader: React.FC<{ companyData: CompanyData; sidebarWidth?: number }> = ({ companyData, sidebarWidth = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear company data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('company_data');
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCompanyDropdown = () => {
    setCompanyDropdownOpen(!companyDropdownOpen);
  };

  return (
    <header
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 transition-all duration-300"
      style={{
        marginLeft: sidebarWidth > 0 ? `${sidebarWidth}px` : '0',
        width: sidebarWidth > 0 ? `calc(100% - ${sidebarWidth}px)` : '100%'
      }}
    >
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/mira-ai.png"
                alt="Mira AI Logo"
               width={150}
                height={50}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/Dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/company/products"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              href="/company/orders"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Orders
            </Link>
            <Link
              href="/company/settings"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Settings
            </Link>
          </nav>

          {/* Right Side - Company Dropdown */}
          <div className="flex items-center space-x-4">
            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
            
            {/* Company Dropdown */}
            <div className="relative">
              <button
                onClick={toggleCompanyDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span className="font-medium">{companyData.name}</span>
                <svg
                  className={`h-4 w-4 transition-transform ${companyDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {companyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/company/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setCompanyDropdownOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm14 4h-2" />
                      </svg>
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`h-6 w-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <Link
                href="/Dashboard"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/company/products"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/company/orders"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                href="/company/settings"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>

              {/* Mobile Company Actions */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <div className="px-2 py-1">
                  <span className="text-sm font-medium text-gray-900">{companyData.name}</span>
                  <p className="text-xs text-gray-500">{companyData.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition-colors font-medium px-2 py-1 text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {companyDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCompanyDropdownOpen(false)}
        />
      )}
    </header>
  );
};

interface HeaderProps {
  sidebarWidth?: number;
}

const Header: React.FC<HeaderProps> = ({ sidebarWidth = 0 }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompany, setHasCompany] = useState(false);
  const router = useRouter();
  const { startNavigation } = useNavigationContext();

  // Check if user has a company account
  useEffect(() => {
    const checkCompanyAccount = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          setHasCompany(false);
          return;
        }

        const response = await fetch('https://api.grayscale-technologies.com/api/v1/companies/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const companies = await response.json();
          const hasCompanyAccount = Array.isArray(companies) && companies.length > 0;
          setHasCompany(hasCompanyAccount);
        } else {
          setHasCompany(false);
        }
      } catch (error) {
        console.error('Error checking company account:', error);
        setHasCompany(false);
      }
    };

    if (isLoggedIn) {
      checkCompanyAccount();
    }
  }, [isLoggedIn]);

  // Check login status without token verification
  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);

      try {
        // Check for company login first
        const companyToken = localStorage.getItem('company_access_token');
        const storedCompanyData = localStorage.getItem('company_data');

        console.log('🏢 Checking company login:', {
          hasToken: !!companyToken,
          hasData: !!storedCompanyData
        });

        if (companyToken && storedCompanyData) {
          try {
            const parsedCompanyData = JSON.parse(storedCompanyData);
            setCompanyData(parsedCompanyData);
            setIsLoggedIn(false);
            setUserData(null);
            console.log('✅ Company logged in:', parsedCompanyData.name);
            setIsLoading(false);
            return;
          } catch (error) {
            console.error('❌ Error parsing company data:', error);
            localStorage.removeItem('company_access_token');
            localStorage.removeItem('company_data');
            setCompanyData(null);
          }
        }

        // Check for regular user login
        const accessToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('userId');
        const displayName = localStorage.getItem('displayName');
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const email = localStorage.getItem('email');
        
        console.log('👤 Checking user login:', { 
          hasToken: !!accessToken, 
          hasUserId: !!userId,
          hasDisplayName: !!displayName,
          hasFirstName: !!firstName,
          hasLastName: !!lastName,
          hasEmail: !!email
        });
        
        if (accessToken && userId) {
          // Check if we have complete user data in localStorage
          if (displayName && firstName && lastName && email) {
            console.log('✅ Complete user data found in localStorage');
            setUserData({
              firstName,
              lastName,
              displayName,
              email,
              userId
            });
            setIsLoggedIn(true);
            setCompanyData(null);
            console.log('✅ User logged in with cached profile data');
          } else {
            console.log('🔄 Token exists but profile incomplete, fetching profile...');
            
            try {
              // Fetch user profile to get complete data
              const profileResponse = await fetch(`https://api.grayscale-technologies.com/api/v1/customers/${userId}/`, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                }
              });
              
              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                console.log('✅ Profile data fetched:', profileData);
                
                // Check if profile is complete
                const hasName = profileData.name?.trim();
                const hasEmail = profileData.email?.trim() || profileData.user?.email?.trim();
                
                if (hasName && hasEmail) {
                  // Store complete profile data
                  localStorage.setItem('customerId', profileData.id?.toString() || '');
                  localStorage.setItem('firstName', profileData.user?.first_name || '');
                  localStorage.setItem('lastName', profileData.user?.last_name || '');
                  localStorage.setItem('displayName', profileData.name || '');
                  localStorage.setItem('email', profileData.email || profileData.user?.email || '');
                  
                  setUserData({
                    firstName: profileData.user?.first_name || '',
                    lastName: profileData.user?.last_name || '',
                    displayName: profileData.name || '',
                    email: profileData.email || profileData.user?.email || '',
                    userId
                  });
                  setIsLoggedIn(true);
                  setCompanyData(null);
                  console.log('✅ User logged in with fetched profile data');
                } else {
                  console.log('⚠️ Profile incomplete, user needs to complete registration');
                  setIsLoggedIn(false);
                  setUserData(null);
                  setCompanyData(null);
                }
              } else {
                console.log('⚠️ Could not fetch profile, treating as incomplete');
                setIsLoggedIn(false);
                setUserData(null);
                setCompanyData(null);
              }
            } catch (profileError) {
              console.error('❌ Error fetching profile:', profileError);
              // Don't clear auth data for network errors, just don't show as logged in
              setIsLoggedIn(false);
              setUserData(null);
              setCompanyData(null);
            }
          }
        } else {
          console.log('❌ No user login data found');
          setIsLoggedIn(false);
          setUserData(null);
          setCompanyData(null);
        }
      } catch (error) {
        console.error('❌ Error checking login status:', error);
        setIsLoggedIn(false);
        setUserData(null);
        setCompanyData(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkLoginStatus();
    
    // Listen for storage changes to update login status
    const handleStorageChange = () => {
      console.log('📢 Storage changed, rechecking login status');
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from login/logout actions
    window.addEventListener('loginStatusChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChanged', handleStorageChange);
    };
  }, []);

  // If company is logged in, show company header
  if (companyData) {
    return <CompanyHeader companyData={companyData} sidebarWidth={sidebarWidth} />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    startNavigation();
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    startNavigation();
    setTimeout(() => {
      router.push('/Dashboard');
    }, 300);
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <header
        className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 transition-all duration-300"
        style={{
          marginLeft: sidebarWidth > 0 ? `${sidebarWidth}px` : '0',
          width: sidebarWidth > 0 ? `calc(100% - ${sidebarWidth}px)` : '100%'
        }}
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/mira-ai.png"
                  alt="Mira AI Logo"
                width={150}
                height={50}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            
            {/* Loading indicator */}
            <div className="flex items-center">
              <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 transition-all duration-300"
      style={{
        marginLeft: sidebarWidth > 0 ? `${sidebarWidth}px` : '0',
        width: sidebarWidth > 0 ? `calc(100% - ${sidebarWidth}px)` : '100%'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/mira-ai.png"
                alt="Mira AI Logo"
                width={150}
                height={50}

                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/Features"
              onClick={(e) => handleNavigation('/Features', e)}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
            >
              Features
            </a>
            <a
              href="/Pricing"
              onClick={(e) => handleNavigation('/Pricing', e)}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="/documentation"
              onClick={(e) => handleNavigation('/documentation', e)}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium cursor-pointer"
            >
              Documentation
            </a>
          </nav>

          {/* Right Side - Auth Links or User Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Show User Dropdown if logged in, otherwise show auth links */}
            {isLoggedIn && userData ? (
              <div className="flex items-center space-x-3">
                {/* Manage Dashboard Button - Only show if user has company */}
                {hasCompany && (
                  <button
                    onClick={handleDashboardClick}
                    className="hidden md:block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium"
                  >
                    Manage Dashboard
                  </button>
                )}
                <UserProfileDropdown />
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="/CompanyAuth"
                  onClick={(e) => handleNavigation('/CompanyAuth', e)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium cursor-pointer"
                >
                  Register your Business
                </a>
                <a
                  href="/CustomerAuth"
                  onClick={(e) => handleNavigation('/CustomerAuth', e)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium cursor-pointer"
                >
                  Login
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`h-6 w-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              <a
                href="/Features"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavigation('/Features', e);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1 cursor-pointer"
              >
                Features
              </a>
              <a
                href="/Pricing"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavigation('/Pricing', e);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1 cursor-pointer"
              >
                Pricing
              </a>
              <a
                href="/documentation"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleNavigation('/documentation', e);
                }}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1 cursor-pointer"
              >
                Documentation
              </a>

              {/* Mobile Auth Links or User Info */}
              {isLoggedIn && userData ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  {/* Manage Dashboard Button - Only show if user has company */}
                  {hasCompany && (
                    <button
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        handleDashboardClick(e);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium text-center"
                    >
                      Manage Dashboard
                    </button>
                  )}
                  <div className="px-2">
                    <UserProfileDropdown />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <a
                    href="/CompanyAuth"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleNavigation('/CompanyAuth', e);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium text-center cursor-pointer"
                  >
                    Join as Company
                  </a>
                  <a
                    href="/CustomerAuth"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleNavigation('/CustomerAuth', e);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-center cursor-pointer"
                  >
                    Login
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;