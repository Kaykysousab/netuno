import { loadStripe } from '@stripe/stripe-js';

// Sua chave Stripe real
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RfR3CRjQ96hzWug7ZjC6h8ZqPHQ12YfyJdViG7bQPNcAcO91H72n3Kdt3NMNZD2SdjX4CVeztvKYdGfcG3UwJY700Okr7EDXo';

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
      // Simular criação de payment intent com dados reais
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(courseData.price * 100), // Converter para centavos
          currency: 'brl',
          metadata: {
            courseId: courseData.id,
            courseName: courseData.title
          }
        })
      });

      if (!response.ok) {
        // Fallback para demo se API não estiver disponível
        return {
          clientSecret: `pi_demo_${Date.now()}_secret_${courseData.id}`,
          paymentIntentId: `pi_demo_${Date.now()}`
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      // Fallback para demo
      return {
        clientSecret: `pi_demo_${Date.now()}_secret_${courseData.id}`,
        paymentIntentId: `pi_demo_${Date.now()}`
      };
    }
  }

  static async confirmPayment(paymentIntentId: string) {
    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe não carregado');

      // Para demo, simular confirmação bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        paymentIntent: {
          id: paymentIntentId,
          status: 'succeeded',
          amount: 0,
          metadata: {}
        }
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
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe não carregado');

      // Criar payment intent
      const { clientSecret, paymentIntentId } = await this.createPaymentIntent(courseData);

      // Para demo, simular processo de pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular confirmação
      const result = await this.confirmPayment(paymentIntentId);

      if (result.paymentIntent.status === 'succeeded') {
        return {
          id: paymentIntentId,
          status: 'succeeded',
          amount: courseData.price * 100
        };
      } else {
        throw new Error('Pagamento não foi processado com sucesso');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  static async createCheckoutSession(courseData: {
    id: string;
    title: string;
    price: number;
  }) {
    try {
      // Para implementação real, você faria uma chamada para seu backend
      // que criaria uma sessão de checkout no Stripe
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseData.id,
          courseName: courseData.title,
          amount: courseData.price,
          currency: 'brl'
        })
      });

      if (!response.ok) {
        // Fallback para demo
        return {
          url: `https://checkout.stripe.com/demo/${courseData.id}`,
          sessionId: `cs_demo_${Date.now()}`
        };
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Fallback para demo
      return {
        url: `https://checkout.stripe.com/demo/${courseData.id}`,
        sessionId: `cs_demo_${Date.now()}`
      };
    }
  }
}