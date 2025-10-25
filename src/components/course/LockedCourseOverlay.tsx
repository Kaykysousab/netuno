import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, CreditCard } from 'lucide-react';
import { Button } from '../common/Button';

interface LockedCourseOverlayProps {
  courseName: string;
  price: number;
  onPurchase: () => void;
}

export const LockedCourseOverlay: React.FC<LockedCourseOverlayProps> = ({
  courseName,
  price,
  onPurchase
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-cosmic-900/95 backdrop-blur-sm flex items-center justify-center rounded-lg"
    >
      <div className="text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Lock size={40} className="text-purple-400" />
        </motion.div>

        <h3 className="text-xl font-bold text-white mb-2">
          Conteúdo Bloqueado
        </h3>
        
        <p className="text-gray-400 mb-6 max-w-sm">
          Para acessar as aulas de <strong>{courseName}</strong>, você precisa adquirir o curso.
        </p>

        <div className="bg-cosmic-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown size={20} className="text-yellow-400" />
            <span className="text-white font-semibold">Acesso Completo</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`}
          </div>
        </div>

        <Button
          onClick={onPurchase}
          icon={price === 0 ? undefined : CreditCard}
          className="w-full"
        >
          {price === 0 ? 'Inscrever-se Gratuitamente' : 'Adquirir Curso'}
        </Button>

        <div className="mt-4 space-y-2 text-sm text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <span>✓</span>
            <span>Acesso vitalício</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>✓</span>
            <span>Certificado de conclusão</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>✓</span>
            <span>Suporte da comunidade</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};