import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    clover?: any;
  }
}

interface CloverPaymentProps {
  amount: number;
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
  clientToken: string;
  disabled?: boolean;
}

export function CloverPayment({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError, 
  clientToken,
  disabled 
}: CloverPaymentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const cardElementRef = useRef<HTMLDivElement>(null);
  const cloverInstanceRef = useRef<any>(null);
  const cardNumberRef = useRef<any>(null);

  useEffect(() => {
    // Load Clover SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.sandbox.dev.clover.com/sdk.js';
    script.async = true;
    script.onload = () => initializeClover();
    script.onerror = () => {
      setIsLoading(false);
      onPaymentError('Failed to load payment processor');
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (cloverInstanceRef.current) {
        cloverInstanceRef.current.destroy();
      }
    };
  }, []);

  const initializeClover = async () => {
    try {
      if (!window.clover) {
        throw new Error('Clover SDK not loaded');
      }

      // Initialize Clover with the client token
      const clover = new window.clover.Ecommerce(clientToken);
      cloverInstanceRef.current = clover;

      const elements = clover.elements();
      
      // Create card element with custom styles
      const styles = {
        body: {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '16px',
          color: '#ffffff'
        },
        input: {
          fontSize: '16px',
          color: '#ffffff',
          '::placeholder': {
            color: '#9ca3af'
          }
        },
        '.invalid': {
          color: '#ef4444'
        }
      };

      // Create card number element
      const cardNumber = elements.create('CARD_NUMBER', { styles });
      cardNumber.mount(cardElementRef.current);
      cardNumberRef.current = cardNumber;

      // Listen for changes to determine if card is complete
      cardNumber.addEventListener('change', (event: any) => {
        setCardComplete(event.complete);
        if (event.error) {
          toast({
            title: "Card Error",
            description: event.error.message,
            variant: "destructive"
          });
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize Clover:', error);
      setIsLoading(false);
      onPaymentError('Failed to initialize payment system');
    }
  };

  const handlePayment = async () => {
    if (!cardComplete || !cloverInstanceRef.current) {
      toast({
        title: "Incomplete Information",
        description: "Please complete all card fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment token
      const result = await cloverInstanceRef.current.createToken();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Send token to your server for processing
      onPaymentSuccess({
        token: result.token,
        card: result.card
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-green-500" />
        <span className="text-sm text-gray-300">Secure payment powered by Clover</span>
      </div>

      <Card className="p-6 bg-white/5 border-white/10">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
            <span className="ml-2 text-white">Loading payment system...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Card Information
              </label>
              <div 
                ref={cardElementRef}
                className="p-3 rounded-md bg-black/20 border border-white/20 min-h-[50px]"
              />
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-medium">Total Amount:</span>
                <span className="text-white font-bold text-xl">
                  ${amount.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handlePayment}
                disabled={!cardComplete || isProcessing || disabled}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${amount.toFixed(2)}
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <img 
                src="/images/payment-visa.svg" 
                alt="Visa" 
                className="h-8 opacity-50"
              />
              <img 
                src="/images/payment-mastercard.svg" 
                alt="Mastercard" 
                className="h-8 opacity-50"
              />
              <img 
                src="/images/payment-amex.svg" 
                alt="American Express" 
                className="h-8 opacity-50"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}