import { ArrowRight, Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import LoadingAnimation from './LoadingAnimation';
// Type definition for Lottie animation instance
interface LottieAnimationItem {
  destroy: () => void;
}

const Hero: React.FC = () => {
  const animationContainer = useRef<HTMLDivElement>(null);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
  

  useEffect(() => {
    let animationInstance: LottieAnimationItem | null = null;
    let isMounted = true;
    
    // Capture the current ref value to avoid stale closure
    const containerElement = animationContainer.current;

    const loadLottie = async () => {
      try {
        // Clear any existing content and animations first
        if (containerElement) {
          // Force clear any existing children
          while (containerElement.firstChild) {
            containerElement.removeChild(containerElement.firstChild);
          }
        }

        // Wait a bit to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!isMounted || !containerElement) return;

        // Dynamically import lottie-web
        const lottie = (await import('lottie-web')).default;
        
        // Double check the container is still available and mounted
        if (isMounted && containerElement) {
          animationInstance = lottie.loadAnimation({
            container: containerElement,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/AI.json',
            // Fixed renderer settings - removed invalid clearCanvas property
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }) as LottieAnimationItem;
        }
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
        // Fallback content with MIRA AI gradient colors
        if (isMounted && containerElement) {
          containerElement.innerHTML = `
            <div class="w-80 h-80 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <div class="w-64 h-64 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
                <div class="text-white font-bold text-4xl">AI</div>
              </div>
            </div>
          `;
        }
      }
    };

    loadLottie();

    // Cleanup function
    return () => {
      isMounted = false;
      
      if (animationInstance) {
        try {
          animationInstance.destroy();
        } catch (e) {
          console.log('Animation already destroyed');
        }
        animationInstance = null;
      }
      
      // Force clear the container using the captured ref
      if (containerElement) {
        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }
      }
    };
  }, []);

  return (
    <>
      {isNavigating && <LoadingAnimation fullScreen message="Redirecting to MIRA AI Chat..." />}
      <section id="home" className=" min-h-screen flex items-center bg-gradient-to-br from-background via-muted/50 to-background">
      <div className="max-w-7xl  px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">SALES</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">ON A SCALE</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Transform your sales process with AI-powered insights, automation, and scalable solutions that grow with your business.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/CompanyAuth" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold px-8 py-4 h-auto transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              {/* Try Demo Button with standard styling */}
              <Link href="/Chat" onClick={() => setIsNavigating(true)}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 h-auto transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try Demo
                </Button>
              </Link>
            </div>
           
          </div>

          {/* Right Content - Lottie Animation */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div 
                ref={animationContainer}
                className="w-80 h-80 flex items-center justify-center"
                style={{ minHeight: '320px', minWidth: '320px' }}
              />
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
};

export default Hero;