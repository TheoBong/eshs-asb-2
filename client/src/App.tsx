import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/contexts/CartContext";
import schoolVideo from "../attached_assets/school2.mp4";

// Shop related pages
import ProductPage from "@/pages/shop/product/index";
import CartPage from "@/pages/shop/cart/index";
import CheckoutPage from "@/pages/shop/checkout/index";

// Information related pages
import Information from "@/pages/information/index";
import Elections from "@/pages/information/elections/index";
import Clubs from "@/pages/information/clubs/index";

// Activities page
import Activities from "@/pages/activities/index";
import EventDetails from "@/pages/activities/details";

// Birds Eye View page
import BirdsEyeView from "./pages/birds-eye-view";

// Admin page
import Admin from "@/pages/admin/index";
import CommaTest from "@/pages/admin/comma-test";

// Navigation Context for SPA
interface NavigationContextType {
  currentPage: string;
  currentParams: Record<string, string>;
  navigateTo: (page: string, params?: Record<string, string>) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

// SPA Page Component with show/hide logic
const SPAPage = ({ 
  isActive, 
  children, 
  pageKey 
}: { 
  isActive: boolean; 
  children: React.ReactNode; 
  pageKey: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="fixed inset-0 w-full h-full"
      style={{
        // Safari-specific fixes for smooth transitions
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: 1000,
        WebkitTransform: 'translateZ(0)',
        backgroundColor: 'transparent',
        zIndex: isActive ? 10 : 1,
        pointerEvents: isActive ? 'auto' : 'none',
        // Force hardware acceleration and prevent flickering
        willChange: 'opacity',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        visibility: isActive ? 'visible' : 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

// SPA Router Component
const SPARouter = () => {
  const { currentPage, currentParams } = useNavigation();
  
  return (
    <div className="relative w-full h-full">
      {/* Home Page */}
      <SPAPage isActive={currentPage === 'home'} pageKey="home">
        <Home />
      </SPAPage>
      
      {/* Shop Pages */}
      <SPAPage isActive={currentPage === 'shop'} pageKey="shop">
        <Shop />
      </SPAPage>
      
      <SPAPage isActive={currentPage === 'product'} pageKey="product">
        <ProductPage />
      </SPAPage>
      
      <SPAPage isActive={currentPage === 'cart'} pageKey="cart">
        <CartPage />
      </SPAPage>
      
      <SPAPage isActive={currentPage === 'checkout'} pageKey="checkout">
        <CheckoutPage />
      </SPAPage>
      
      {/* Information Pages */}
      <SPAPage isActive={currentPage === 'information'} pageKey="information">
        <Information />
      </SPAPage>
      
      <SPAPage isActive={currentPage === 'elections'} pageKey="elections">
        <Elections />
      </SPAPage>
      
      <SPAPage isActive={currentPage === 'clubs'} pageKey="clubs">
        <Clubs />
      </SPAPage>
      
      {/* Activities Pages */}
      <SPAPage isActive={currentPage === 'activities'} pageKey="activities">
        <Activities />
      </SPAPage>
      
      <SPAPage isActive={currentPage === 'event-details'} pageKey="event-details">
        <EventDetails />
      </SPAPage>
      
      {/* Birds Eye View */}
      <SPAPage isActive={currentPage === 'birds-eye-view'} pageKey="birds-eye-view">
        <BirdsEyeView />
      </SPAPage>
      
      {/* Admin */}
      <SPAPage isActive={currentPage === 'admin'} pageKey="admin">
        <Admin />
      </SPAPage>
      
      {/* Test Pages */}
      <SPAPage isActive={currentPage === 'comma-test'} pageKey="comma-test">
        <CommaTest />
      </SPAPage>
      
      {/* 404 */}
      <SPAPage isActive={currentPage === '404'} pageKey="404">
        <NotFound />
      </SPAPage>
    </div>
  );
};

// Create persistent background component outside of main app
const PersistentBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Safari-specific fixes to prevent video unloading
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Force hardware acceleration on Safari
    if (isSafari) {
      video.style.willChange = 'transform';
      video.style.backfaceVisibility = 'hidden';
      video.style.perspective = '1000px';
      video.style.WebkitBackfaceVisibility = 'hidden';
      video.style.WebkitPerspective = '1000px';
    }

    // Preload and setup video
    const setupVideo = async () => {
      try {
        // Force load the video
        video.load();
        
        // Wait for video to be ready
        await new Promise((resolve, reject) => {
          video.onloadeddata = resolve;
          video.onerror = reject;
          
          // Fallback timeout
          setTimeout(reject, 10000);
        });
        
        setIsLoaded(true);
        
        // Start playing
        await video.play();
        
        // Safari-specific: Keep a global reference to prevent GC
        (window as any).safariPersistentVideo = video;
        
      } catch (error) {
        console.warn('Video autoplay failed, will retry on user interaction:', error);
        
        // Retry on first user interaction
        const playOnInteraction = async () => {
          try {
            await video.play();
            setIsLoaded(true);
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
          } catch (e) {
            console.warn('Failed to play video on interaction:', e);
          }
        };
        
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      }
    };

    setupVideo();

    // Visibility change handler - more aggressive for Safari
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) {
        video.play().catch(() => {
          // Silent fail
        });
      }
    };

    // Page focus handler - Safari sometimes pauses on blur
    const handlePageFocus = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Silent fail
        });
      }
    };

    // Safari-specific: prevent video from being paused during page transitions
    const preventPause = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (isSafari) {
      video.addEventListener('pause', preventPause);
      video.addEventListener('suspend', preventPause);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handlePageFocus);
    
    // Safari-specific: force video to stay active during page transitions
    const maintainVideoState = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };
    
    const intervalId = setInterval(maintainVideoState, 100);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handlePageFocus);
      clearInterval(intervalId);
      
      if (isSafari) {
        video.removeEventListener('pause', preventPause);
        video.removeEventListener('suspend', preventPause);
      }
    };
  }, []);
  
  return (
    <div 
      id="persistent-background"
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{
        zIndex: -1000,
        backgroundColor: '#000',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    >
      {/* Fallback black background for when video is loading */}
      <div 
        className="absolute inset-0 bg-black"
        style={{
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          zIndex: 1
        }}
      />
      
      <video 
        ref={videoRef}
        id="background-video"
        autoPlay 
        muted 
        loop 
        playsInline
        preload="auto"
        data-persistent="true"
        className="absolute w-full h-full object-cover"
        style={{
          objectFit: 'cover',
          width: '100vw',
          height: '100vh',
          filter: 'brightness(0.8) contrast(1.15) saturate(1.05)',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          opacity: isLoaded ? 1 : 0,
          visibility: 'visible',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          transition: 'opacity 0.5s ease-in-out',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: '1000px',
          perspective: '1000px'
        }}
      >
        <source src={schoolVideo} type="video/mp4" />
      </video>
      
      {/* Overlay to darken the background video */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

// Navigation Provider Component
const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentParams, setCurrentParams] = useState<Record<string, string>>({});
  
  // Update browser URL without page reload
  useEffect(() => {
    const updateURL = () => {
      const routes: Record<string, string> = {
        'home': '/',
        'shop': '/shop',
        'product': `/shop/product/${currentParams.id || ''}`,
        'cart': '/shop/cart',
        'checkout': '/shop/checkout',
        'information': '/information',
        'elections': '/information/elections',
        'clubs': '/information/clubs',
        'activities': '/activities',
        'event-details': `/activities/details/${currentParams.id || ''}`,
        'birds-eye-view': '/birds-eye-view',
        'admin': '/admin',
        'comma-test': '/comma-test'
      };
      
      const url = routes[currentPage] || '/';
      window.history.replaceState({}, '', url);
    };
    
    updateURL();
  }, [currentPage, currentParams]);
  
  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const pageFromPath = getPageFromPath(path);
      setCurrentPage(pageFromPath.page);
      setCurrentParams(pageFromPath.params);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Set initial page from URL
    const initialPageData = getPageFromPath(window.location.pathname);
    setCurrentPage(initialPageData.page);
    setCurrentParams(initialPageData.params);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const navigateTo = (page: string, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setCurrentParams(params);
  };
  
  return (
    <NavigationContext.Provider value={{ currentPage, currentParams, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Helper function to determine page from URL path
const getPageFromPath = (path: string): { page: string; params: Record<string, string> } => {
  const segments = path.split('/').filter(Boolean);
  
  if (!segments.length) return { page: 'home', params: {} };
  
  switch (segments[0]) {
    case 'shop':
      if (segments[1] === 'product' && segments[2]) {
        return { page: 'product', params: { id: segments[2] } };
      }
      if (segments[1] === 'cart') return { page: 'cart', params: {} };
      if (segments[1] === 'checkout') return { page: 'checkout', params: {} };
      return { page: 'shop', params: {} };
      
    case 'information':
      if (segments[1] === 'elections' || segments[1] === 'student-government') {
        return { page: 'elections', params: {} };
      }
      if (segments[1] === 'clubs') return { page: 'clubs', params: {} };
      return { page: 'information', params: {} };
      
    case 'activities':
      if (segments[1] === 'details' && segments[2]) {
        return { page: 'event-details', params: { id: segments[2] } };
      }
      return { page: 'activities', params: {} };
      
    case 'birds-eye-view':
      return { page: 'birds-eye-view', params: {} };
      
    case 'admin':
      return { page: 'admin', params: {} };
      
    case 'comma-test':
      return { page: 'comma-test', params: {} };
      
    default:
      return { page: '404', params: {} };
  }
};

function App() {
  return (
    <>
      {/* Persistent background - never leaves DOM */}
      <PersistentBackground />
      
      {/* Main app content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <NavigationProvider>
              <TooltipProvider>
                <Toaster />
                <SPARouter />
              </TooltipProvider>
            </NavigationProvider>
          </CartProvider>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
