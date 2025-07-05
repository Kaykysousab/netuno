import { loadStripe } from '@stripe/stripe-js';

// Use Stripe test publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RfR3CRjQ96hzWug7ZjC6h8ZqPHQ12YfyJdViG7bQPNcAcO91H72n3Kdt3NMNZD2SdjX4CVeztvKYdGfcG3UwJY700Okr7EDXo'

let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export class StripeService {
  static async createPaymentIntent(courseData: {
    id: string;
    title: string;
    price: number;
  }) {
    try {
      // For demo purposes, simulate creating a payment intent
      return {
        clientSecret: `pi_demo_${Date.now()}_secret_demo`,
        paymentIntentId: `pi_demo_${Date.now()}`
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId: string) {
    try {
      // For demo purposes, simulate payment confirmation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Payment confirmed successfully'
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  static async processPayment(courseData: {
    id: string;
    title: string;
    price: number;
  }) {
    try {
      // For demo purposes, simulate the entire payment process
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not loaded');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        id: `pi_demo_${Date.now()}`,
        status: 'succeeded',
        amount: courseData.price * 100
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
}