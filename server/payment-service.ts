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
      
      // Create an order using Clover's v3 API first
      const orderData = {
        currency: request.currency || 'USD',
        total: Math.round(request.amount * 100), // Convert to cents
        state: 'open',
        note: `Order for ${request.metadata?.customerName || 'Customer'}`
      };

      console.log('Creating order with data:', orderData);

      const orderResponse = await axios.post(
        `${this.baseUrl}/v3/merchants/${this.merchantId}/orders`,
        orderData,
        { headers: this.getHeaders() }
      );

      const orderId = orderResponse.data.id;
      console.log('Created order with ID:', orderId);

      // Add line items to the order
      if (request.metadata?.items) {
        const items = JSON.parse(request.metadata.items);
        for (const item of items) {
          await axios.post(
            `${this.baseUrl}/v3/merchants/${this.merchantId}/orders/${orderId}/line_items`,
            {
              name: item.name,
              price: Math.round(item.price * 100),
              quantity: item.quantity || 1
            },
            { headers: this.getHeaders() }
          );
        }
      }

      // Create the hosted checkout URL for this specific order
      const hostedCheckoutUrl = this.environment === 'production'
        ? `https://www.clover.com/online-payments/${this.merchantId}/pay/${orderId}`
        : `https://sandbox.dev.clover.com/online-payments/${this.merchantId}/pay/${orderId}`;

      return {
        orderId: orderId,
        amount: request.amount,
        currency: request.currency || 'USD',
        checkoutUrl: hostedCheckoutUrl,
        status: 'pending'
      };
    } catch (error: any) {
      console.error('Failed to create payment intent:', error.response?.data || error.message);
      console.error('Full error:', error);
      throw new Error(`Failed to create payment intent: ${error.response?.data?.message || error.message}`);
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