import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import NotFound from "@/pages/not-found";

// Shop related pages
import ProductPage from "@/pages/shop/product/index";
import CartPage from "@/pages/shop/cart/index";
import CheckoutPage from "@/pages/shop/checkout/index";


// Information related pages
import Information from "@/pages/information/index";
import Representatives from "@/pages/information/representatives/index";
import Elections from "@/pages/information/elections/index";
import Seniors from "@/pages/information/seniors/index";
import Organizations from "@/pages/information/organizations/index";
import Calendar from "@/pages/information/calendar/index";

// Birds Eye View page
import BirdsEyeView from "@/pages/birds-eye-view/index";

// Page wrapper component for fade transitions
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
      className="w-full h-full"
    >
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
        <Route path="/information/representatives" component={() => <PageWrapper><Representatives /></PageWrapper>} />
        <Route path="/information/elections" component={() => <PageWrapper><Elections /></PageWrapper>} />
        <Route path="/information/seniors" component={() => <PageWrapper><Seniors /></PageWrapper>} />
        <Route path="/information/organizations" component={() => <PageWrapper><Organizations /></PageWrapper>} />
        <Route path="/information/organizations/:id" component={() => <PageWrapper><Organizations /></PageWrapper>} />
        <Route path="/information/calendar" component={() => <PageWrapper><Calendar /></PageWrapper>} />
        
        {/* Birds Eye View */}
        <Route path="/birds-eye-view" component={() => <PageWrapper><BirdsEyeView /></PageWrapper>} />
        
        {/* 404 page */}
        <Route component={() => <PageWrapper><NotFound /></PageWrapper>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
