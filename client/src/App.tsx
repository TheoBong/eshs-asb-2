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
import schoolVideo from "../../attached_assets/school2.mp4";

// Video caching utility
class VideoCache {
  private cacheName = 'eshs-video-cache-v1';
  private dbName = 'eshs-video-db';
  private storeName = 'videos';
  private maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  async getCachedVideoUrl(originalUrl: string): Promise<string> {
    try {
      // Try Cache API first (most efficient)
      if ('caches' in window) {
        const cache = await caches.open(this.cacheName);
        const cachedResponse = await cache.match(originalUrl);
        
        if (cachedResponse) {
          console.log('Video loaded from Cache API');
          return URL.createObjectURL(await cachedResponse.blob());
        }
        
        // Cache the video for future use
        await this.cacheVideo(originalUrl);
        return originalUrl;
      }
      
      // Fallback to IndexedDB for older browsers
      return await this.getFromIndexedDB(originalUrl) || originalUrl;
    } catch (error) {
      console.warn('Video caching failed, using original URL:', error);
      return originalUrl;
    }
  }

  private async cacheVideo(url: string): Promise<void> {
    try {
      if ('caches' in window) {
        const cache = await caches.open(this.cacheName);
        
        // Check if already cached
        const existing = await cache.match(url);
        if (existing) return;
        
        console.log('Caching video...');
        await cache.add(url);
        console.log('Video cached successfully');
        
        // Clean up old cache entries
        await this.cleanupCache();
      } else {
        // Fallback: cache in IndexedDB
        await this.cacheInIndexedDB(url);
      }
    } catch (error) {
      console.warn('Failed to cache video:', error);
    }
  }

  private async cleanupCache(): Promise<void> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name.startsWith('eshs-video-cache') && name !== this.cacheName
        );
        
        await Promise.all(oldCaches.map(name => caches.delete(name)));
      }
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  private async getFromIndexedDB(url: string): Promise<string | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => resolve(null);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const getRequest = store.get(url);
        
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result && (Date.now() - result.timestamp < this.maxCacheAge)) {
            const blob = new Blob([result.data], { type: 'video/mp4' });
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(null);
          }
        };
        
        getRequest.onerror = () => resolve(null);
      };
    });
  }

  private async cacheInIndexedDB(url: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // Fetch the video
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        
        const request = indexedDB.open(this.dbName, 1);
        
        request.onerror = () => reject(request.error);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'url' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          
          store.put({
            url,
            data: arrayBuffer,
            timestamp: Date.now()
          });
          
          transaction.oncomplete = () => {
            console.log('Video cached in IndexedDB');
            resolve();
          };
          
          transaction.onerror = () => reject(transaction.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async preloadVideo(url: string): Promise<void> {
    // Preload video in background
    await this.cacheVideo(url);
  }

  async clearCache(): Promise<void> {
    try {
      if ('caches' in window) {
        await caches.delete(this.cacheName);
      }
      
      // Clear IndexedDB
      return new Promise((resolve, reject) => {
        const deleteReq = indexedDB.deleteDatabase(this.dbName);
        deleteReq.onsuccess = () => resolve();
        deleteReq.onerror = () => reject(deleteReq.error);
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

const videoCache = new VideoCache();

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
      className="absolute inset-0 w-full min-h-screen overflow-y-auto"
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
        display: isActive ? 'block' : 'none'
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
    <div className="relative w-full min-h-screen">
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
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Video element found, URL:', schoolVideo);
    
    // Simple play attempt
    const playVideo = async () => {
      try {
        console.log('Attempting to play video...');
        await video.play();
        console.log('Video playing successfully');
        
        // Safari-specific: Keep a global reference to prevent GC
        (window as any).safariPersistentVideo = video;
        
      } catch (error) {
        console.warn('Video autoplay failed, will retry on user interaction:', error);
        
        // Retry on first user interaction
        const playOnInteraction = async () => {
          try {
            await video.play();
            console.log('Video playing after user interaction');
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

    // Wait a bit for the video to load then try to play
    const timeoutId = setTimeout(playVideo, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <div 
      id="persistent-background"
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{
        zIndex: -1,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Video background container that fills the whole screen */}
      <div className="absolute inset-0 bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          data-persistent="true"
          className="absolute w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            width: '100vw',
            height: '100vh',
            filter: 'brightness(0.8) contrast(1.15) saturate(1.05)',
            minWidth: '100%',
            minHeight: '100%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <source src={schoolVideo} type="video/mp4" />
        </video>
        
        {/* Overlay to darken the background video */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};

// Navigation Provider Component
const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from current URL
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      const initialPageData = getPageFromPath(window.location.pathname);
      return {
        page: initialPageData.page,
        params: initialPageData.params
      };
    }
    return { page: 'home', params: {} };
  };
  
  const [currentPage, setCurrentPage] = useState<string>(() => getInitialState().page);
  const [currentParams, setCurrentParams] = useState<Record<string, string>>(() => getInitialState().params);
  
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
      
      // Only update URL if it's different from current
      if (window.location.pathname !== url) {
        window.history.replaceState({}, '', url);
      }
    };
    
    updateURL();
  }, [currentPage, currentParams]);
  
  // Handle browser back/forward buttons and initial load
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const pageFromPath = getPageFromPath(path);
      setCurrentPage(pageFromPath.page);
      setCurrentParams(pageFromPath.params);
    };
    
    window.addEventListener('popstate', handlePopState);
    
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
  // Preload video in background on app start
  useEffect(() => {
    const preloadVideo = async () => {
      try {
        await videoCache.preloadVideo(schoolVideo);
        console.log('Background video preloaded and cached');
      } catch (error) {
        console.warn('Video preload failed:', error);
      }
    };
    
    // Start preloading after a short delay to not block initial render
    const timeoutId = setTimeout(preloadVideo, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);
  
  return (
    <>
      {/* Persistent background - never leaves DOM */}
      <PersistentBackground />
      
      {/* Main app content */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', backgroundColor: 'transparent' }}>
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
