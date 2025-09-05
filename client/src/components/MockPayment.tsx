import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MockPaymentProps {
  amount: number;
  onPaymentSuccess: (paymentResult: any) => void;
  onPaymentError: (error: string) => void;
  disabled?: boolean;
}

export function MockPayment({ 
  amount, 
  onPaymentSuccess, 
  onPaymentError, 
  disabled 
}: MockPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateCardData = () => {
    const cardNumberClean = cardData.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 13) {
      throw new Error('Invalid card number');
    }
    if (cardData.expiryDate.length !== 5) {
      throw new Error('Invalid expiry date');
    }
    if (cardData.cvv.length < 3) {
      throw new Error('Invalid CVV');
    }
    if (cardData.cardholderName.length < 2) {
      throw new Error('Cardholder name required');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      validateCardData();

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success (you can add logic to simulate failures for testing)
      const paymentResult = {
        token: 'mock_token_' + Date.now(),
        card: {
          last4: cardData.cardNumber.slice(-4),
          brand: 'visa', // Mock brand
          exp_month: cardData.expiryDate.split('/')[0],
          exp_year: cardData.expiryDate.split('/')[1]
        }
      };

      onPaymentSuccess(paymentResult);
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormComplete = () => {
    return cardData.cardNumber.replace(/\s/g, '').length >= 13 &&
           cardData.expiryDate.length === 5 &&
           cardData.cvv.length >= 3 &&
           cardData.cardholderName.length >= 2;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-green-500" />
        <span className="text-sm text-gray-300">Secure payment processing (Demo Mode)</span>
      </div>

      <Card className="p-6 bg-white/5 border-white/10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber" className="block text-sm font-medium text-white mb-2">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              value={cardData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="bg-black/20 border-white/20 text-white"
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="block text-sm font-medium text-white mb-2">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                value={cardData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                placeholder="MM/YY"
                className="bg-black/20 border-white/20 text-white"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="block text-sm font-medium text-white mb-2">
                CVV
              </Label>
              <Input
                id="cvv"
                value={cardData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                className="bg-black/20 border-white/20 text-white"
                maxLength={4}
                type="password"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardholderName" className="block text-sm font-medium text-white mb-2">
              Cardholder Name
            </Label>
            <Input
              id="cardholderName"
              value={cardData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              placeholder="John Doe"
              className="bg-black/20 border-white/20 text-white"
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
              disabled={!isFormComplete() || isProcessing || disabled}
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

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              This is a demo payment form. No real payment will be processed.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}