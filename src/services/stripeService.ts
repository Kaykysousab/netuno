import { loadStripe } from '@stripe/stripe-js';
import { apiService } from './api';

let stripePromise: Promise<any> | null = null;

export const getStripe = async () => {
  if (!stripePromise) {
    try {
      const config = await apiService.getStripeConfig();
      stripePromise = loadStripe(config.publishableKey);
    } catch (error) {
      console.error('Error loading Stripe:', error);
      throw error;
    }
  }
  return stripePromise;
};

export class StripeService {
  static async createPaymentIntent(courseId: string) {
    try {
      const response = await apiService.createPaymentIntent(courseId);
      return response;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId: string) {
    try {
      const response = await apiService.confirmPayment(paymentIntentId);
      return response;
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
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not loaded');

      // Create payment intent
      const { clientSecret } = await this.createPaymentIntent(courseData.id);

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // This would be replaced with actual card element in real implementation
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Confirm payment on backend
      await this.confirmPayment(result.paymentIntent.id);

      return result.paymentIntent;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }
}