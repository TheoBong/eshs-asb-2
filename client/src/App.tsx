import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import NotFound from "@/pages/not-found";

// Shop related pages
import ProductPage from "@/pages/shop/product/index";
import CartPage from "@/pages/shop/cart/index";
import CheckoutPage from "@/pages/shop/checkout/index";

// Activities related pages
import Activities from "@/pages/activities/index";
import EventPage from "@/pages/activities/event/index";

// Information related pages
import Information from "@/pages/information/index";
import Representatives from "@/pages/information/representatives/index";
import Elections from "@/pages/information/elections/index";
import Seniors from "@/pages/information/seniors/index";
import Organizations from "@/pages/information/organizations/index";
import Calendar from "@/pages/information/calendar/index";

// Birds Eye View page
import BirdsEyeView from "@/pages/birds-eye-view/index";

function Router() {
  return (
    <Switch>
      {/* Main pages */}
      <Route path="/" component={Home} />
      
      {/* Shop pages */}
      <Route path="/shop" component={Shop} />
      <Route path="/shop/product/:id" component={ProductPage} />
      <Route path="/shop/cart" component={CartPage} />
      <Route path="/shop/checkout" component={CheckoutPage} />
      
      {/* Activities pages */}
      <Route path="/activities" component={Activities} />
      <Route path="/activities/event/:id" component={EventPage} />
      
      {/* Information pages */}
      <Route path="/information" component={Information} />
      <Route path="/information/representatives" component={Representatives} />
      <Route path="/information/elections" component={Elections} />
      <Route path="/information/seniors" component={Seniors} />
      <Route path="/information/organizations" component={Organizations} />
      <Route path="/information/organizations/:id" component={Organizations} />
      <Route path="/information/calendar" component={Calendar} />
      
      {/* Birds Eye View */}
      <Route path="/birds-eye-view" component={BirdsEyeView} />
      
      {/* 404 page */}
      <Route component={NotFound} />
    </Switch>
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
