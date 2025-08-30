import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, SecondaryButton, OutlineButton } from "@/components/ThemedComponents";
import { useCart } from "@/contexts/CartContext";
import { UniversalPageLayout } from "@/components/UniversalPageLayout";
import { BlurContainer, BlurCard, BlurActionButton } from "@/components/UniversalBlurComponents";

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
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (id: number | string, change: number, size?: string, color?: string) => {
    updateQuantity(id, change, size, color);
  };

  const handleRemoveItem = (id: number | string, size?: string, color?: string) => {
    removeFromCart(id, size, color);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleContinueShopping = () => {
    const referrer = sessionStorage.getItem('cart-referrer');
    // Default to /shop if no referrer is found
    setLocation(referrer || "/shop");
    // Clear the referrer after using it
    sessionStorage.removeItem('cart-referrer');
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
  const total = subtotal + tax;

  return (
    <UniversalPageLayout pageType="shop" title="Your Shopping Cart" backButtonText="Back">
      {({ contentVisible }) => (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <BlurContainer contentVisible={contentVisible} delay="200ms" className="overflow-hidden">
                <div className="p-6">
                  {cartItems.length > 0 ? (
                    <div className="space-y-6">
                      {cartItems.map((item, index) => (
                        <BlurCard 
                          key={item.id} 
                          contentVisible={contentVisible}
                          index={index}
                          delay={`${300 + (index * 100)}ms`}
                          className="flex gap-4 pb-6 border-b border-white/10 last:border-b-0 last:pb-0"
                        >
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
                                <button
                                  className="h-8 w-8 rounded-r-none bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
                                  onClick={() => handleQuantityChange(item.id, -1, item.size, item.color)}
                                >
                                  -
                                </button>
                                <div className="h-8 w-12 flex items-center justify-center border-y border-white/10 bg-white/5 text-white">
                                  {item.quantity}
                                </div>
                                <button
                                  className="h-8 w-8 rounded-l-none bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors duration-300 flex items-center justify-center"
                                  onClick={() => handleQuantityChange(item.id, 1, item.size, item.color)}
                                >
                                  +
                                </button>
                              </div>
                              
                              {/* Remove Button */}
                              <BlurActionButton
                                contentVisible={contentVisible}
                                onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                                className="text-red-400 hover:text-red-300 py-2 px-3 text-sm flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                Remove
                              </BlurActionButton>
                            </div>
                          </div>
                        </BlurCard>
                      ))}
                      
                      {/* Keep Shopping Button */}
                      <div className="text-center">
                        <BlurActionButton 
                          contentVisible={contentVisible}
                          onClick={handleContinueShopping}
                          className="py-2 px-4"
                        >
                          Continue Shopping
                        </BlurActionButton>
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
                        <BlurActionButton 
                          contentVisible={contentVisible}
                          onClick={handleContinueShopping}
                          className="py-3 px-6 font-semibold"
                        >
                          Start Shopping
                        </BlurActionButton>
                      </div>
                    </div>
                  )}
                </div>
              </BlurContainer>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <BlurContainer contentVisible={contentVisible} delay="400ms" className="overflow-hidden">
                <div className="p-6">
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
                    
                    <BlurActionButton
                      contentVisible={contentVisible}
                      onClick={handleCheckout}
                      className="w-full mt-4 py-3 px-6 font-semibold bg-gray-600 hover:bg-gray-700 cursor-not-allowed"
                      disabled={true}
                    >
                      Coming Soon
                    </BlurActionButton>
                    
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-300">
                        By proceeding to checkout, you acknowledge that your order may be subject to additional processing time.
                      </p>
                    </div>
                  </div>
                </div>
              </BlurContainer>

              {/* School Organization Support */}
              <BlurContainer contentVisible={contentVisible} delay="500ms" className="mt-6 p-6">
                <div className="flex items-center mb-4">
                  <Badge className="bg-emerald-500">Supporting School Organizations</Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Your purchase directly supports our school's organizations and activities. 
                  Thank you for your contribution to our community!
                </p>
              </BlurContainer>
            </div>
          </div>
        </>
      )}
    </UniversalPageLayout>
  );
}