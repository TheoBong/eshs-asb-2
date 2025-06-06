import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemedPageWrapper, ThemedCard, PrimaryButton, SecondaryButton, OutlineButton, ThemedInput } from "@/components/ThemedComponents";
import schoolVideo from "../../../../../attached_assets/school2.mp4";

// Mock cart items for the order summary
const cartItems = [
  {
    id: 1,
    name: "El Segundo Eagles T-Shirt",
    price: 25.99,
    quantity: 1,
    size: "M",
    color: "Blue"
  },
  {
    id: 3,
    name: "Eagles Water Bottle",
    price: 15.99,
    quantity: 2,
    color: "Silver"
  }
];

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [billingIsSameAsShipping, setBillingIsSameAsShipping] = useState(true);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "CA",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleBackToCart = () => {
    setLocation("/shop/cart");
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode'
    ];
    
    if (paymentMethod === 'credit') {
      requiredFields.push('cardNumber', 'cardName', 'expiry', 'cvv');
    }
    
    const emptyFields = requiredFields.filter(field => !formState[field as keyof typeof formState]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Please fill in all required fields",
        description: `The following fields are required: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      toast({
        title: "Invalid email address",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Order successfully placed!",
        description: "Thank you for your purchase. You will receive an email confirmation shortly.",
      });
      
      // Redirect to a thank you page (could be implemented later)
      setLocation("/shop");
    }, 2000);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;
  return (
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
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>      {/* Main content */}
      <div className="relative z-10 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Transparent back button with title */}
          <div className="flex items-center mb-8">
            <Button
              onClick={handleBackToCart}
              variant="ghost"
              className="flex items-center text-white/90 hover:text-white transition-colors font-semibold p-2 mr-4"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 className="text-3xl font-bold text-white">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">            {/* Checkout Form */}            <div className="lg:col-span-2">              <ThemedCard>
                <form onSubmit={handleSubmit}>
                  <CardContent className="p-6">
                    {/* Contact Information */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-200">First Name *</Label>
                          <ThemedInput
                            id="firstName"
                            name="firstName"
                            value={formState.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formState.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formState.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formState.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Shipping Information */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formState.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formState.city}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Select 
                              value={formState.state} 
                              onValueChange={value => setFormState(prev => ({ ...prev, state: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AL">Alabama</SelectItem>
                                <SelectItem value="AK">Alaska</SelectItem>
                                <SelectItem value="AZ">Arizona</SelectItem>
                                <SelectItem value="AR">Arkansas</SelectItem>
                                <SelectItem value="CA">California</SelectItem>
                                <SelectItem value="CO">Colorado</SelectItem>
                                {/* More states would be listed here */}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">ZIP Code *</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formState.zipCode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Billing Information */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Billing Information</h2>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="billing-same"
                            checked={billingIsSameAsShipping}
                            onCheckedChange={(checked) => setBillingIsSameAsShipping(checked as boolean)}
                          />
                          <Label htmlFor="billing-same" className="text-sm">
                            Billing address is same as shipping
                          </Label>
                        </div>
                      </div>
                      
                      {!billingIsSameAsShipping && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="billingAddress">Street Address *</Label>
                            <Input id="billingAddress" required={!billingIsSameAsShipping} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billingCity">City *</Label>
                              <Input id="billingCity" required={!billingIsSameAsShipping} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingState">State *</Label>
                              <Select defaultValue="CA">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AL">Alabama</SelectItem>
                                  <SelectItem value="AK">Alaska</SelectItem>
                                  <SelectItem value="AZ">Arizona</SelectItem>
                                  <SelectItem value="AR">Arkansas</SelectItem>
                                  <SelectItem value="CA">California</SelectItem>
                                  <SelectItem value="CO">Colorado</SelectItem>
                                  {/* More states would be listed here */}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="billingZipCode">ZIP Code *</Label>
                              <Input id="billingZipCode" required={!billingIsSameAsShipping} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Payment Information */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit" id="payment-credit" />
                          <Label htmlFor="payment-credit" className="flex items-center">
                            Credit Card
                            <div className="ml-2 flex space-x-1">
                              <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="38" height="24" rx="4" fill="#1434CB" />
                                <path d="M14.9254 16.4199H12.729L14.1435 7.58008H16.3399L14.9254 16.4199Z" fill="white" />
                                <path d="M23.9111 7.77441C23.4654 7.60113 22.7448 7.41016 21.8593 7.41016C19.7064 7.41016 18.1629 8.51113 18.1537 10.0908C18.1351 11.2199 19.2546 11.8522 20.0961 12.2332C20.9561 12.6234 21.2206 12.8783 21.2206 13.2318C21.2113 13.7699 20.5744 14.0156 19.9839 14.0156C19.1332 14.0156 18.6876 13.8884 17.9856 13.5715L17.7025 13.4258L17.4009 15.3649C17.9298 15.5932 18.9335 15.7934 19.9744 15.8025C22.2644 15.8025 23.7801 14.7107 23.7894 13.0197C23.7987 12.1185 23.2081 11.4219 21.9162 10.8563C21.1214 10.4935 20.6386 10.2477 20.6386 9.85742C20.6479 9.50293 21.0375 9.13965 21.8593 9.13965C22.5519 9.12207 23.0719 9.29535 23.4746 9.46863L23.6825 9.5596L23.9111 7.77441Z" fill="white" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M27.2302 7.58008H25.5422L23.2988 16.4199H25.0053L25.3021 15.2999H27.8312C27.8869 15.5107 28.0762 16.4199 28.0762 16.4199H29.6382L27.2302 7.58008ZM25.8018 13.5893C25.8018 13.5893 26.3587 11.9612 26.5665 11.3596C26.7744 10.758 26.9079 10.362 26.9079 10.362C26.8987 10.3796 27.0324 10.0261 27.1103 9.81758L27.2302 10.3266C27.2302 10.3266 27.5921 13.0696 27.6664 13.5893H25.8018Z" fill="white" />
                                <path d="M10.9508 7.58008L9.36133 13.4258L9.18201 12.5246C8.8711 11.509 7.73382 10.4084 6.47021 9.84277L7.91886 16.4111H9.64391L12.6739 7.58008H10.9508Z" fill="white" />
                                <path d="M8.09784 8.63281H5.50115L5.46484 8.78809C7.63511 9.34863 9.09245 10.7188 9.65707 12.5334L8.89104 9.14063C8.79973 8.7417 8.49347 8.6504 8.09784 8.63281Z" fill="#FABB2D" />
                              </svg>
                              <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="38" height="24" rx="4" fill="#252525" />
                                <path d="M15.2078 16.4004H12.793V7.60059H15.2078V16.4004Z" fill="#EB691B" />
                                <path d="M13.0004 7.60059C11.6672 7.60059 10.5996 8.67822 10.5996 10.0114C10.5996 11.3446 11.6772 12.4222 13.0004 12.4222C14.3336 12.4222 15.4012 11.3446 15.4012 10.0114C15.4012 8.67822 14.3336 7.60059 13.0004 7.60059Z" fill="#EB691B" />
                                <path d="M25.2064 7.60059H23.1496C22.7048 7.60059 22.3392 7.83739 22.1816 8.20303L19.584 14.3126H21.9992L22.4248 13.1334H25.0136L25.2504 14.3126H27.416L25.2064 7.60059ZM22.9624 11.5222L23.792 9.12739L24.2768 11.5222H22.9624Z" fill="#EB691B" />
                                <path d="M19.584 16.4004L21.4584 8.67822C21.5864 8.17501 21.3304 7.60059 20.7168 7.60059H18.4408L18.3816 7.84819C20.0168 8.2858 21.252 9.47681 21.7456 10.9494L19.584 16.4004Z" fill="#EB691B" />
                              </svg>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="schoolpay" id="payment-schoolpay" />
                          <Label htmlFor="payment-schoolpay">SchoolPay (Online Student Account)</Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "credit" && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="XXXX XXXX XXXX XXXX"
                              value={formState.cardNumber}
                              onChange={handleInputChange}
                              required={paymentMethod === "credit"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardName">Name on Card *</Label>
                            <Input
                              id="cardName"
                              name="cardName"
                              value={formState.cardName}
                              onChange={handleInputChange}
                              required={paymentMethod === "credit"}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiration Date (MM/YY) *</Label>
                              <Input
                                id="expiry"
                                name="expiry"
                                placeholder="MM/YY"
                                value={formState.expiry}
                                onChange={handleInputChange}
                                required={paymentMethod === "credit"}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">Security Code (CVV) *</Label>
                              <Input
                                id="cvv"
                                name="cvv"
                                type="password"
                                value={formState.cvv}
                                onChange={handleInputChange}
                                required={paymentMethod === "credit"}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "schoolpay" && (
                        <div className="space-y-4 border-t pt-4">
                          <div className="p-4 bg-blue-50 rounded-md">
                            <p className="text-sm">
                              You will be redirected to the SchoolPay system to complete this purchase using your student account balance.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>                </form>
              </ThemedCard>
            </div>            {/* Order Summary */}            <div className="lg:col-span-1">
              <ThemedCard className="sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-300">
                        <div>
                          <div className="font-medium text-white">{item.name}</div>
                          <div className="text-sm text-gray-400">
                            {item.size && <span className="mr-1">Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <div className="text-sm">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8.75%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                    {/* Place Order Button */}
                  <PrimaryButton
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>                    ) : (
                      "Place Order"
                    )}
                  </PrimaryButton>
                    <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                      By placing your order, you agree to the Terms of Service and Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </ThemedCard>                {/* Security Notice */}
              <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium text-white">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-300">
                  All transactions are secure and encrypted. Your personal information is never shared with third parties.
                </p>
              </div>
            </div>          </div>
        </div>
      </div>
    </ThemedPageWrapper>
  );
}
