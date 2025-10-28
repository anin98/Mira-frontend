'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const navigateTo = useCallback((path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push(path);
    }, 300);
  }, [router]);

  return {
    isNavigating,
    navigateTo,
    setIsNavigating
  };
};
