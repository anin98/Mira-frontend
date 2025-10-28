'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LoadingAnimation from '../components/LoadingAnimation';

interface NavigationContextType {
  isNavigating: boolean;
  startNavigation: () => void;
  stopNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  const startNavigation = () => setIsNavigating(true);
  const stopNavigation = () => setIsNavigating(false);

  // Auto-stop navigation when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {isNavigating && <LoadingAnimation fullScreen message="Loading..." />}
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};
