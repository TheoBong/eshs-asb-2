import axios from 'axios';
import crypto from 'crypto';

interface CloverPaymentRequest {
  amount: number;
  currency: string;
  source: string;
  description?: string;
  metadata?: Record<string, any>;
}

interface CloverPaymentResponse {
  id: string;
  amount: number;
  currency: string;
  created: number;
  status: 'succeeded' | 'pending' | 'failed';
  source: any;
  metadata?: Record<string, any>;
}

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  paymentMethodTypes?: string[];
  metadata?: {
    orderId?: string;
    customerEmail?: string;
    customerName?: string;
    items?: string;
  };
}

class PaymentService {
  private privateToken: string;
  private merchantId: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor() {
    this.privateToken = process.env.CLOVER_PRIVATE_TOKEN || '';
    this.merchantId = process.env.CLOVER_MERCHANT_ID || '';
    this.environment = (process.env.CLOVER_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
    
    this.baseUrl = this.environment === 'production' 
      ? 'https://api.clover.com'
      : 'https://apisandbox.dev.clover.com';

    if (!this.privateToken || !this.merchantId) {
      console.warn('⚠️ Clover Hosted Checkout credentials not configured. Payment processing will not work.');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.privateToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async createPaymentIntent(request: PaymentIntentRequest): Promise<any> {
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      
      // For Hosted Checkout, create a checkout session using the checkout API
      const checkoutData = {
        merchant_id: this.merchantId,
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency || 'USD',
        success_url: `${clientUrl}/shop/checkout/success`,
        cancel_url: `${clientUrl}/shop/checkout/cancel`,
        customer: {
          email: request.metadata?.customerEmail,
          name: request.metadata?.customerName
        },
        line_items: JSON.parse(request.metadata?.items || '[]').map((item: any) => ({
          name: item.name,
          amount: Math.round(item.price * 100),
          quantity: item.quantity || 1
        }))
      };

      console.log('Creating checkout session with data:', checkoutData);

      // Use the correct Hosted Checkout endpoint
      const checkoutUrl = this.environment === 'production'
        ? 'https://checkout.clover.com/checkout'
        : 'https://checkout-sandbox.dev.clover.com/checkout';

      const checkoutResponse = await axios.post(
        checkoutUrl,
        checkoutData,
        { headers: this.getHeaders() }
      );

      const sessionId = checkoutResponse.data.id || checkoutResponse.data.session_id;
      const hostedUrl = checkoutResponse.data.url || checkoutResponse.data.checkout_url;

      return {
        orderId: sessionId,
        amount: request.amount,
        currency: request.currency || 'USD',
        checkoutUrl: hostedUrl,
        status: 'pending'
      };
    } catch (error: any) {
      console.error('Failed to create checkout session:', error.response?.data || error.message);
      
      // Fallback: Create a simple payment link if the checkout API doesn't work
      const fallbackOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create a simple Clover payment link
      const paymentParams = new URLSearchParams({
        merchant_id: this.merchantId,
        amount: Math.round(request.amount * 100).toString(),
        currency: request.currency || 'USD',
        success_url: `${clientUrl}/shop/checkout/success`,
        cancel_url: `${clientUrl}/shop/checkout/cancel`,
        customer_email: request.metadata?.customerEmail || '',
        customer_name: request.metadata?.customerName || '',
        order_id: fallbackOrderId
      });

      const fallbackCheckoutUrl = this.environment === 'production'
        ? `https://www.clover.com/checkout?${paymentParams.toString()}`
        : `https://checkout-sandbox.dev.clover.com?${paymentParams.toString()}`;

      return {
        orderId: fallbackOrderId,
        amount: request.amount,
        currency: request.currency || 'USD',
        checkoutUrl: fallbackCheckoutUrl,
        status: 'pending'
      };
    }
  }

  async processPayment(paymentToken: string, orderId: string): Promise<any> {
    try {
      // Process payment with Clover
      const response = await axios.post(
        `${this.baseUrl}/v1/orders/${orderId}/pay`,
        {
          source: paymentToken,
          receipt_email: true
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        transactionId: response.data.id,
        status: response.data.status,
        amount: response.data.amount / 100, // Convert from cents
        paymentMethod: response.data.source?.brand || 'card',
        last4: response.data.source?.last4
      };
    } catch (error: any) {
      console.error('Payment processing failed:', error.response?.data || error.message);
      throw new Error('Payment processing failed');
    }
  }

  async getPaymentStatus(orderId: string): Promise<any> {
    try {
      // For hosted checkout, we'll rely on webhooks for status updates
      // This method can be used to query Clover's API if needed
      const response = await axios.get(
        `${this.baseUrl}/v3/merchants/${this.merchantId}/orders`,
        { 
          headers: this.getHeaders(),
          params: { filter: `note='${orderId}'` }
        }
      );

      if (response.data.elements && response.data.elements.length > 0) {
        const order = response.data.elements[0];
        return {
          orderId: orderId,
          status: order.state,
          amount: order.total / 100,
          paymentStatus: order.paymentState || 'pending'
        };
      }

      return {
        orderId: orderId,
        status: 'pending',
        amount: 0,
        paymentStatus: 'pending'
      };
    } catch (error: any) {
      console.error('Failed to get payment status:', error.response?.data || error.message);
      return {
        orderId: orderId,
        status: 'pending',
        amount: 0,
        paymentStatus: 'pending'
      };
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/refunds`,
        {
          charge: transactionId,
          amount: amount ? Math.round(amount * 100) : undefined
        },
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        refundId: response.data.id,
        amount: response.data.amount / 100,
        status: response.data.status
      };
    } catch (error: any) {
      console.error('Refund failed:', error.response?.data || error.message);
      throw new Error('Refund processing failed');
    }
  }

  // Generate a secure payment token for client-side use
  generateClientToken(orderId: string): string {
    const timestamp = Date.now();
    const data = `${this.merchantId}:${orderId}:${timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.apiKey)
      .update(data)
      .digest('hex');
    
    return Buffer.from(JSON.stringify({
      merchantId: this.merchantId,
      orderId,
      timestamp,
      signature,
      environment: this.environment
    })).toString('base64');
  }

  // Verify webhook signature from Clover
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.apiKey)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

export const paymentService = new PaymentService();