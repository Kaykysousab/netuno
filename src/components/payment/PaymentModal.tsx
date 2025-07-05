import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { StripeService } from '../../services/stripeService';
import { useAuth } from '../../context/AuthContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: string;
    title: string;
    price: number;
    instructor: string;
    thumbnail: string;
  };
  onPaymentSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  course,
  onPaymentSuccess
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    setPaymentStep('processing');

    try {
      if (course.price === 0) {
        // Free course - enroll directly
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
          setPaymentStep('form');
        }, 2000);
      } else {
        // Paid course - process payment
        await StripeService.processPayment({
          id: course.id,
          title: course.title,
          price: course.price
        });
        
        setPaymentStep('success');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
          setPaymentStep('form');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Erro ao processar pagamento. Tente novamente.');
      setPaymentStep('form');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setPaymentStep('form');
      setError(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-md border border-cosmic-700"
            onClick={(e) => e.stopPropagation()}
          >
            {paymentStep === 'form' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {course.price === 0 ? 'Inscrever-se' : 'Finalizar Compra'}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Course Info */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{course.title}</h3>
                      <p className="text-gray-400 text-sm">{course.instructor}</p>
                    </div>
                  </div>

                  <div className="bg-cosmic-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Preço:</span>
                      <span className="text-2xl font-bold text-white">
                        {course.price === 0 ? 'Gratuito' : `R$ ${course.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Shield size={16} className="text-green-400" />
                    <span>Pagamento seguro via Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Lock size={16} className="text-green-400" />
                    <span>Acesso vitalício ao curso</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>Certificado de conclusão</span>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Action Button */}
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={handlePayment}
                    loading={loading}
                    disabled={loading}
                    icon={course.price === 0 ? undefined : CreditCard}
                  >
                    {course.price === 0 
                      ? 'Inscrever-se Gratuitamente' 
                      : `Pagar R$ ${course.price.toFixed(2)}`
                    }
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>

                {/* Demo Notice */}
                <div className="mt-6 pt-6 border-t border-cosmic-700">
                  <p className="text-xs text-gray-500 text-center">
                    🎭 Demo: O pagamento será simulado para fins de demonstração
                  </p>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Processando Pagamento...
                </h3>
                <p className="text-gray-400">
                  Por favor, aguarde enquanto processamos seu pagamento.
                </p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle size={32} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Pagamento Confirmado!
                </h3>
                <p className="text-gray-400">
                  Você agora tem acesso ao curso. Redirecionando...
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};