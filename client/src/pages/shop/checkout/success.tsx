import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UniversalPageLayout } from "@/components/UniversalPageLayout";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

export default function CheckoutSuccessPage() {
  const [, setLocation] = useLocation();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Clear the cart and session storage
    setTimeout(() => {
      clearCart();
      sessionStorage.removeItem('checkout-form-data');
      sessionStorage.removeItem('checkout-cart-items');
      setIsProcessing(false);
    }, 2000);

    // Show success message
    toast({
      title: "Payment Successful!",
      description: "Your order has been confirmed. You'll receive a confirmation email shortly.",
    });
  }, [clearCart]);

  const handleContinueShopping = () => {
    setLocation("/shop");
  };

  const handleViewOrders = () => {
    // In a real app, this would go to an order history page
    setLocation("/shop");
  };

  return (
    <UniversalPageLayout 
      pageType="shop" 
      title="Payment Successful" 
      showBackButton={false}
    >
      {({ contentVisible }) => (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Card className="p-8 bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-2xl text-center">
            {isProcessing ? (
              <div className="space-y-6">
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Processing your order...</h2>
                  <p className="text-gray-300">Please wait while we confirm your payment.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
                  <p className="text-gray-300 mb-6">
                    Thank you for your purchase. Your order has been confirmed and is being processed.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">What's next?</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    You'll receive a confirmation email shortly. Your order will be prepared according to your selected delivery method.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleContinueShopping}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
                  >
                    Continue Shopping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Button
                    onClick={handleViewOrders}
                    variant="outline"
                    className="w-full bg-white/5 hover:bg-white/10 text-white border-white/20"
                  >
                    Back to Shop
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </UniversalPageLayout>
  );
}