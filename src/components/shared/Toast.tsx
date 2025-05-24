import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const toastVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 }
};

const toastStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};

const toastIcons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`
            fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50
            px-6 py-4 rounded-2xl shadow-soft-lg border
            flex items-center gap-3 min-w-[300px] max-w-[500px]
            ${toastStyles[type]}
          `}
        >
          <span className="text-2xl">{toastIcons[type]}</span>
          <p className="flex-1 text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Hooks
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    message: string;
    type: ToastProps['type'];
  }>>([]);

  const showToast = (message: string, type: ToastProps['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, hideToast };
};

// Specific Toast Components
export const ToastSuccess: React.FC<Pick<ToastProps, 'message' | 'isVisible' | 'onClose'>> = (props) => (
  <Toast {...props} type="success" />
);

export const ToastError: React.FC<Pick<ToastProps, 'message' | 'isVisible' | 'onClose'>> = (props) => (
  <Toast {...props} type="error" />
);

export const ToastWarning: React.FC<Pick<ToastProps, 'message' | 'isVisible' | 'onClose'>> = (props) => (
  <Toast {...props} type="warning" />
);

export const ToastInfo: React.FC<Pick<ToastProps, 'message' | 'isVisible' | 'onClose'>> = (props) => (
  <Toast {...props} type="info" />
);

// Specific error toasts
export const ToastErrorDuplicate: React.FC<Omit<ToastProps, 'message' | 'type'>> = (props) => (
  <Toast {...props} message="Ya existe un contacto con este email" type="error" />
);

export const ToastPermission: React.FC<Omit<ToastProps, 'message' | 'type'>> = (props) => (
  <Toast {...props} message="No tienes permisos para realizar esta acción" type="warning" />
);

export const ToastNetwork: React.FC<Omit<ToastProps, 'message' | 'type'>> = (props) => (
  <Toast {...props} message="Error de conexión. Por favor, intenta de nuevo" type="error" />
); 