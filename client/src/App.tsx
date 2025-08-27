import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import NotFound from "@/pages/not-found";
import { CartProvider } from "@/contexts/CartContext";
import schoolVideo from "../../attached_assets/school2.mp4";

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


// Page wrapper component for fade transitions
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
      className="w-full h-full relative"
      style={{
        // Safari-specific fixes for smooth transitions
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: 1000,
        WebkitTransform: 'translate3d(0,0,0)',
        backgroundColor: 'transparent',
        // Force hardware acceleration and prevent flickering
        willChange: 'opacity',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {/* Video background inside the stacking context */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          webkit-playsinline="true"
          x5-playsinline="true"
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
          onError={(e) => {
            console.error('Video failed to load:', e);
            console.log('Video src:', schoolVideo);
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
        >
          <source src={schoolVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Vignette overlay applied directly over video */}
        <div className="absolute inset-0 bg-black bg-opacity-35"></div>
      </div>
      {children}
    </motion.div>
  );
};

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          {/* Video background now moved to PageWrapper for proper stacking context */}
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
