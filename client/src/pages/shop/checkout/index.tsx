import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, OutlineButton, ThemedInput } from "@/components/ThemedComponents";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { cartItems, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roomTeacher: "" // For fourth period delivery
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackToCart = () => {
    setLocation("/shop/cart");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order Received!",
        description: "Your order has been submitted successfully. You will receive a confirmation email shortly.",
      });

      clearCart();
      setLocation("/shop");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;

  return (
    <ThemedPageWrapper pageType="shop">
      {/* Main content */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <OutlineButton
              onClick={handleBackToCart}
              className="bg-white/3 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-semibold p-3 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </OutlineButton>
            <h1 className="font-bold text-2xl md:text-3xl text-white tracking-tight">
              Order Information
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <ThemedCard className="bg-white/3 backdrop-blur-2xl border border-white/10 shadow-2xl">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-white">First Name *</Label>
                        <ThemedInput
                          id="firstName"
                          value={formState.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                        <ThemedInput
                          id="lastName"
                          value={formState.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <ThemedInput
                        id="email"
                        type="email"
                        value={formState.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white">Phone *</Label>
                      <ThemedInput
                        id="phone"
                        type="tel"
                        value={formState.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    {/* Delivery Method */}
                    <div>
                      <Label className="text-white text-lg font-medium mb-4 block">Delivery Method *</Label>
                      <RadioGroup 
                        value={deliveryMethod} 
                        onValueChange={setDeliveryMethod}
                        className="space-y-4"
                      >
                        <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
                          <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="pickup" className="text-white font-medium cursor-pointer">
                              Pick Up at Activities Office at ESHS
                            </Label>
                            <p className="text-gray-300 text-sm mt-1">
                              Collect your order during school hours at the Activities Office
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
                          <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="delivery" className="text-white font-medium cursor-pointer">
                              Fourth Period Delivery For Students
                            </Label>
                            <p className="text-gray-300 text-sm mt-1 mb-3">
                              Have your order delivered to your fourth period classroom
                            </p>
                            {deliveryMethod === "delivery" && (
                              <div>
                                <Label htmlFor="roomTeacher" className="text-white text-sm">Room Number / Teacher Name *</Label>
                                <ThemedInput
                                  id="roomTeacher"
                                  value={formState.roomTeacher}
                                  onChange={(e) => handleInputChange('roomTeacher', e.target.value)}
                                  placeholder="e.g. Room 301 / Mr. Smith"
                                  required={deliveryMethod === "delivery"}
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="pt-4">
                      <PrimaryButton
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        disabled={isSubmitting || cartItems.length === 0}
                      >
                        {isSubmitting ? "Submitting Order..." : "Submit Order"}
                      </PrimaryButton>
                    </div>
                  </form>
                </div>
              </ThemedCard>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <ThemedCard className="bg-white/3 backdrop-blur-2xl border border-white/10 shadow-2xl sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{item.name}</h3>
                          {item.size && <p className="text-gray-300 text-sm">Size: {item.size}</p>}
                          {item.color && <p className="text-gray-300 text-sm">Color: {item.color}</p>}
                          <p className="text-gray-300 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-white font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Tax (8.75%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-white/20">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-500/20 border border-amber-400/50 rounded-lg">
                    <p className="text-amber-200 text-sm">
                      <strong>Note:</strong> This is a pre-order system. You will be contacted when your items are ready for pickup or delivery.
                    </p>
                  </div>
                </div>
              </ThemedCard>
            </div>
          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}