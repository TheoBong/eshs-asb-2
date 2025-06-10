import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, SecondaryButton, OutlineButton } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Cart items interface - supports both shop items and event tickets
interface CartItem {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: string;
  color?: string;
  type?: 'product' | 'event';
  eventId?: string;
}

export default function CartPage() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cart utility functions
  const getCartFromCookies = (): CartItem[] => {
    try {
      const cartData = document.cookie
        .split('; ')
        .find(row => row.startsWith('cart='))
        ?.split('=')[1];
      return cartData ? JSON.parse(decodeURIComponent(cartData)) : [];
    } catch {
      return [];
    }
  };

  const saveCartToCookies = (items: CartItem[]) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    document.cookie = `cart=${encodeURIComponent(JSON.stringify(items))}; expires=${expires.toUTCString()}; path=/`;
  };

  // Load cart from cookies on component mount
  useEffect(() => {
    const cookieCart = getCartFromCookies();
    setCartItems(cookieCart);
  }, []);

  const handleQuantityChange = (id: number | string, change: number) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });
    setCartItems(updatedItems);
    saveCartToCookies(updatedItems);
  };

  const handleRemoveItem = (id: number | string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    saveCartToCookies(updatedItems);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleContinueShopping = () => {
    setLocation("/shop");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to checkout page
    setLocation("/shop/checkout");
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;  return (
    <ThemedPageWrapper pageType="shop">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src={schoolVideo} type="video/mp4" />
        </video>
      </div>

      {/* Overlay to darken the background video */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={handleContinueShopping}
              className="text-white/90 hover:text-white p-2 mr-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div>
              <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">Your Shopping Cart</h1>
              <p className="text-gray-300">Review your items before checkout</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">            {/* Cart Items */}
            <div className="lg:col-span-2">
              <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardContent className="p-6">
                  {cartItems.length > 0 ? (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-6 border-b border-white/10 last:border-b-0 last:pb-0">
                          {/* Product/Event Image */}
                          <div className="w-24 h-24 bg-gray-900 rounded-md overflow-hidden">
                            {item.type === 'event' ? (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                              </div>
                            ) : (
                              <img
                                src={item.image || "/api/placeholder/100/100"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/100?text=Product";
                                }}
                              />
                            )}
                          </div>
                          
                          {/* Product/Event Details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold text-white">{item.name}</h3>
                                <div className="text-sm text-gray-300">
                                  {item.type === 'event' ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-200 border border-blue-500/30">
                                      Event Ticket
                                    </span>
                                  ) : (
                                    <>
                                      {item.size && <span className="mr-2">Size: {item.size}</span>}
                                      {item.color && <span>Color: {item.color}</span>}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              {/* Quantity Control */}
                              <div className="flex items-center">
                                <OutlineButton
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                >
                                  -
                                </OutlineButton>
                                <div className="h-8 w-12 flex items-center justify-center border-y border-white/10 bg-white/5 text-white">
                                  {item.quantity}
                                </div>
                                <OutlineButton
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                >
                                  +
                                </OutlineButton>
                              </div>
                              
                              {/* Remove Button */}
                              <OutlineButton
                                size="sm"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                Remove
                              </OutlineButton>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Keep Shopping Button */}
                      <div className="text-center">
                        <OutlineButton onClick={handleContinueShopping}>
                          Continue Shopping
                        </OutlineButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-white">Your cart is empty</h3>
                      <p className="mt-1 text-gray-300">Looks like you haven't added anything to your cart yet.</p>
                      <div className="mt-6">
                        <PrimaryButton onClick={handleContinueShopping}>Start Shopping</PrimaryButton>
                      </div>
                    </div>
                  )}
                </CardContent>
              </ThemedCard>
            </div>              {/* Order Summary */}
            <div className="lg:col-span-1">
              <ThemedCard className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal ({cartItems.reduce((a, item) => a + item.quantity, 0)} items)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Estimated Tax (8.75%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    
                    <Separator className="my-4 bg-white/10" />
                    
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <PrimaryButton
                      className="w-full mt-4"
                      disabled={cartItems.length === 0}
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </PrimaryButton>
                    
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-300">
                        By proceeding to checkout, you acknowledge that your order may be subject to additional processing time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </ThemedCard>                {/* School Organization Support */}
              <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Badge className="bg-emerald-500">Supporting School Organizations</Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Your purchase directly supports our school's organizations and activities. 
                  Thank you for your contribution to our community!
                </p>
              </div>
            </div>          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
