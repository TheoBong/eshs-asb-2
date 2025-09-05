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
  private apiKey: string;
  private merchantId: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLOVER_API_KEY || '';
    this.merchantId = process.env.CLOVER_MERCHANT_ID || '';
    this.environment = (process.env.CLOVER_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
    
    this.baseUrl = this.environment === 'production' 
      ? 'https://api.clover.com'
      : 'https://sandbox.dev.clover.com';

    if (!this.apiKey || !this.merchantId) {
      console.warn('⚠️ Clover API credentials not configured. Payment processing will not work.');
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async createPaymentIntent(request: PaymentIntentRequest): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/orders`,
        {
          amount: Math.round(request.amount * 100), // Convert to cents
          currency: request.currency || 'USD',
          state: 'open',
          note: request.metadata ? JSON.stringify(request.metadata) : undefined
        },
        { headers: this.getHeaders() }
      );

      return {
        orderId: response.data.id,
        amount: request.amount,
        currency: request.currency || 'USD',
        clientToken: response.data.clientToken,
        status: 'pending'
      };
    } catch (error: any) {
      console.error('Failed to create payment intent:', error.response?.data || error.message);
      throw new Error('Failed to create payment intent');
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
      const response = await axios.get(
        `${this.baseUrl}/v1/orders/${orderId}`,
        { headers: this.getHeaders() }
      );

      return {
        orderId: response.data.id,
        status: response.data.state,
        amount: response.data.total / 100,
        paymentStatus: response.data.paymentState || 'pending'
      };
    } catch (error: any) {
      console.error('Failed to get payment status:', error.response?.data || error.message);
      throw new Error('Failed to get payment status');
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