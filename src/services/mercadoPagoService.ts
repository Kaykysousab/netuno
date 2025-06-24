// Mercado Pago Service
export class MercadoPagoService {
  private static readonly PUBLIC_KEY = 'APP_USR-77e78eba-4f6b-46d7-ab01-96bd9e146987';
  private static readonly ACCESS_TOKEN = 'APP_USR-7016729332198506-062019-6d5719ba7edfd8cb306797551ab86758-1932370319';
  private static readonly WEBHOOK_SECRET = 'ccd3b32b1cca46f6e85df2f5ba2e504e7a7d41d7c56026d18e5c6e9434f3d341';

  static async createPayment(courseData: {
    title: string;
    price: number;
    courseId: string;
    userId: string;
  }) {
    try {
      const preference = {
        items: [
          {
            title: courseData.title,
            unit_price: courseData.price,
            quantity: 1,
            currency_id: 'BRL',
            id: courseData.courseId,
          }
        ],
        payer: {
          email: 'test@test.com', // Em produção, usar email real do usuário
        },
        back_urls: {
          success: `${window.location.origin}/payment/success`,
          failure: `${window.location.origin}/payment/failure`,
          pending: `${window.location.origin}/payment/pending`,
        },
        auto_return: 'approved',
        external_reference: `${courseData.userId}-${courseData.courseId}`,
        notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
        metadata: {
          user_id: courseData.userId,
          course_id: courseData.courseId,
        },
      };

      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar preferência de pagamento');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro no Mercado Pago:', error);
      throw error;
    }
  }

  static async getPaymentStatus(paymentId: string) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar status do pagamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao consultar pagamento:', error);
      throw error;
    }
  }

  static getCheckoutScript() {
    return new Promise((resolve, reject) => {
      if (window.MercadoPago) {
        resolve(window.MercadoPago);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => {
        window.MercadoPago.setPublishableKey(this.PUBLIC_KEY);
        resolve(window.MercadoPago);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// Extend Window interface for MercadoPago
declare global {
  interface Window {
    MercadoPago: any;
  }
}