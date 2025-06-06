import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Mock cart items
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export default function CartPage() {
  const [, setLocation] = useLocation();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "El Segundo Eagles T-Shirt",
      price: 25.99,
      image: "/api/placeholder/300/300",
      quantity: 1,
      size: "M",
      color: "Blue"
    },
    {
      id: 3,
      name: "Eagles Water Bottle",
      price: 15.99,
      image: "/api/placeholder/300/300",
      quantity: 2,
      color: "Silver"
    }
  ]);

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
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
  const total = subtotal + tax;

  return (
    <>
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Your Shopping Cart</h1>
            <p className="text-xl text-blue-100">Review your items before checkout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="bg-black/85 backdrop-blur-xl border border-gray-500/50 shadow-2xl overflow-hidden">
                <CardContent className="p-6">
                  {cartItems.length > 0 ? (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-700 last:border-b-0 last:pb-0">
                          {/* Product Image */}
                          <div className="w-24 h-24 bg-gray-900 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/100?text=Product";
                              }}
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <div className="text-sm text-gray-500">
                                  {item.size && <span className="mr-2">Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              </div>
                              <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center">
                              {/* Quantity Control */}
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-r-none"
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                >
                                  -
                                </Button>
                                <div className="h-8 w-12 flex items-center justify-center border-y border-input">
                                  {item.quantity}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 rounded-l-none"
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                >
                                  +
                                </Button>
                              </div>
                              
                              {/* Remove Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Keep Shopping Button */}
                      <div className="text-center">
                        <Button
                          variant="outline"
                          onClick={handleContinueShopping}
                          className="text-sky-700 border-sky-700 hover:bg-sky-50"
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
                      <p className="mt-1 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                      <div className="mt-6">
                        <Button onClick={handleContinueShopping}>Start Shopping</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>              {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-black/85 backdrop-blur-xl border border-gray-500/50 shadow-2xl overflow-hidden">
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
                    
                    <Separator className="my-4 bg-gray-700" />
                    
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <Button
                      size="lg"
                      className="w-full mt-4"
                      disabled={cartItems.length === 0}
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">
                        By proceeding to checkout, you acknowledge that your order may be subject to additional processing time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>                {/* School Organization Support */}
              <div className="mt-6 bg-black/80 backdrop-blur-xl border border-gray-500/50 shadow-xl rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Badge className="bg-emerald-500">Supporting School Organizations</Badge>
                </div>
                <p className="text-sm text-gray-300">
                  Your purchase directly supports our school's organizations and activities. 
                  Thank you for your contribution to our community!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
