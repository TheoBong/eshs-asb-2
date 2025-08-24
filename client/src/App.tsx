import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
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

// Page wrapper component for crossfade transitions
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="w-full min-h-screen absolute inset-0"
      style={{
        // Safari-specific fixes for smooth transitions
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: 1000,
        WebkitTransform: 'translateZ(0)',
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        // Force hardware acceleration and prevent flickering
        willChange: 'opacity',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {children}
    </motion.div>
  );
};

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence>
      <Switch key={location}>
        {/* Main pages */}
        <Route path="/" component={() => <PageWrapper><Home /></PageWrapper>} />
        
        {/* Shop pages */}
        <Route path="/shop" component={() => <PageWrapper><Shop /></PageWrapper>} />
        <Route path="/shop/product/:id" component={() => <PageWrapper><ProductPage /></PageWrapper>} />
        <Route path="/shop/cart" component={() => <PageWrapper><CartPage /></PageWrapper>} />
        <Route path="/shop/checkout" component={() => <PageWrapper><CheckoutPage /></PageWrapper>} />
        
        {/* Information pages */}
        <Route path="/information" component={() => <PageWrapper><Information /></PageWrapper>} />
        <Route path="/information/student-government" component={() => <PageWrapper><Elections /></PageWrapper>} />
        <Route path="/information/elections" component={() => <PageWrapper><Elections /></PageWrapper>} />
        <Route path="/information/clubs" component={() => <PageWrapper><Clubs /></PageWrapper>} />
        
        {/* Activities page */}        <Route path="/activities" component={() => <PageWrapper><Activities /></PageWrapper>} />
        <Route path="/activities/details/:id" component={() => <PageWrapper><EventDetails /></PageWrapper>} />
        
        {/* Birds Eye View */}
        <Route path="/birds-eye-view" component={() => <PageWrapper><BirdsEyeView /></PageWrapper>} />
          {/* Admin page */}
        <Route path="/admin" component={() => <PageWrapper><Admin /></PageWrapper>} />
        {/* Testing and debugging routes */}
        <Route path="/comma-test" component={() => <PageWrapper><CommaTest /></PageWrapper>} />
        
        {/* 404 page */}
        <Route component={() => <PageWrapper><NotFound /></PageWrapper>} />
      </Switch>
    </AnimatePresence>
  );
}

// Create persistent background component outside of main app
const PersistentBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Ensure video plays and stays playing
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Retry playing after user interaction if autoplay is blocked
        document.addEventListener('click', () => {
          video.play();
        }, { once: true });
      });
      
      // Keep video playing during visibility changes
      const handleVisibilityChange = () => {
        if (!document.hidden && video.paused) {
          video.play();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Prevent video from being garbage collected
      (window as any).persistentVideo = video;
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
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
        bottom: 0
      }}
    >
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
          opacity: 1,
          visibility: 'visible',
          position: 'absolute',
          top: 0,
          left: 0
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
          bottom: 0
        }}
      />
    </div>
  );
};

function App() {
  return (
    <>
      {/* Persistent background outside of all providers */}
      <PersistentBackground />
      
      {/* Main app content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
