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
import { UniversalPageLayout } from "@/components/UniversalPageLayout";
import { BlurContainer, BlurCard, BlurActionButton } from "@/components/UniversalBlurComponents";
import { MockPayment } from "@/components/MockPayment";
import { createPaymentIntent, processPayment } from "@/lib/api";

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
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleBackToCart = () => {
    setLocation("/shop/cart");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate delivery details
    if (deliveryMethod === "delivery" && !formState.roomTeacher) {
      toast({
        title: "Missing Information",
        description: "Please provide room number and teacher name for delivery.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo mode, skip payment intent creation and go straight to payment
      setShowPayment(true);
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    setIsSubmitting(true);
    
    try {
      // Create purchase record directly (mock mode)
      const purchaseData = {
        studentName: `${formState.firstName} ${formState.lastName}`,
        studentEmail: formState.email,
        phone: formState.phone,
        productName: cartItems.map(item => item.name).join(', '),
        quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        amount: total,
        paymentMethod: 'card',
        status: 'paid',
        transactionId: paymentResult.token,
        paymentDetails: {
          last4: paymentResult.card.last4,
          brand: paymentResult.card.brand
        },
        deliveryMethod,
        deliveryDetails: deliveryMethod === 'delivery' ? {
          roomTeacher: formState.roomTeacher
        } : undefined,
        date: new Date()
      };

      // In a real implementation, this would call your API to save the purchase
      console.log('Purchase data:', purchaseData);

      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully. You will receive a confirmation email shortly.",
      });

      clearCart();
      setLocation("/shop");
    } catch (error) {
      toast({
        title: "Payment Error", 
        description: "There was an error processing your order. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setShowPayment(false);
    setIsSubmitting(false);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;

  return (
    <UniversalPageLayout 
      pageType="shop" 
      title="Order Information" 
      backButtonText="Back to Cart"
      onBackClick={handleBackToCart}
    >
      {({ contentVisible }) => (
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <div 
                className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500 ease-out"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transform: contentVisible ? 'translateY(0px)' : 'translateY(20px)',
                  transitionDelay: '200ms'
                }}
              >
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

                    {!showPayment ? (
                      <div className="pt-4">
                        <button
                          onClick={handleSubmit}
                          className="w-full py-3 px-6 font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting || cartItems.length === 0}
                        >
                          {isSubmitting ? "Initializing Payment..." : "Proceed to Payment"}
                        </button>
                      </div>
                    ) : (
                      <div className="pt-4">
                        <MockPayment
                          amount={total}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <BlurContainer contentVisible={contentVisible} delay="300ms" className="sticky top-8 overflow-hidden">
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
              </BlurContainer>
            </div>
          </div>
        </div>
      )}
    </UniversalPageLayout>
  );
}