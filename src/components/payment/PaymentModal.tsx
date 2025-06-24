import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { MercadoPagoService } from '../../services/mercadoPagoService';
import { SupabaseService } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';
import type { Course } from '../../lib/supabase';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
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
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment record in Supabase
      const payment = await SupabaseService.createPayment({
        user_id: user.id,
        course_id: course.id,
        amount: course.price,
        currency: 'BRL',
        status: 'pending',
      });

      // Create Mercado Pago preference
      const preference = await MercadoPagoService.createPayment({
        title: course.title,
        price: course.price,
        courseId: course.id,
        userId: user.id,
      });

      // Create enrollment with pending payment
      await SupabaseService.enrollInCourse(user.id, course.id, {
        amount: course.price,
        paymentId: preference.id,
      });

      // Redirect to Mercado Pago checkout
      window.open(preference.init_point, '_blank');
      
      // Show success message and close modal
      onPaymentSuccess();
      onClose();

    } catch (err) {
      console.error('Payment error:', err);
      setError('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await SupabaseService.enrollInCourse(user.id, course.id);
      onPaymentSuccess();
      onClose();
    } catch (err) {
      console.error('Enrollment error:', err);
      setError('Erro ao inscrever no curso. Tente novamente.');
    } finally {
      setLoading(false);
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
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-cosmic-900 rounded-2xl p-8 w-full max-w-md border border-cosmic-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {course.price === 0 ? 'Inscrever-se' : 'Finalizar Compra'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
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
                <span>Pagamento seguro via Mercado Pago</span>
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
              {course.price === 0 ? (
                <Button
                  className="w-full"
                  onClick={handleFreeEnrollment}
                  loading={loading}
                  disabled={loading}
                >
                  Inscrever-se Gratuitamente
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handlePayment}
                  loading={loading}
                  disabled={loading}
                  icon={CreditCard}
                >
                  Pagar R$ {course.price.toFixed(2)}
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>

            {/* Payment Methods */}
            {course.price > 0 && (
              <div className="mt-6 pt-6 border-t border-cosmic-700">
                <p className="text-xs text-gray-400 text-center mb-3">
                  Métodos de pagamento aceitos:
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="bg-cosmic-800 rounded px-2 py-1 text-xs text-gray-300">
                    Cartão
                  </div>
                  <div className="bg-cosmic-800 rounded px-2 py-1 text-xs text-gray-300">
                    PIX
                  </div>
                  <div className="bg-cosmic-800 rounded px-2 py-1 text-xs text-gray-300">
                    Boleto
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};