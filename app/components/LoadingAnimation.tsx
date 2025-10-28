'use client';
import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LoadingAnimationProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  message = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (containerRef.current && !animationRef.current) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/Loading.json'
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <div className="text-center">
          <div ref={containerRef} className="w-32 h-32 mx-auto" />
          {message && (
            <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div ref={containerRef} className="w-24 h-24 mx-auto" />
        {message && (
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;
