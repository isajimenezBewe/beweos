import React from 'react';
import { Button } from '@heroui/button';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8"
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button
          color="primary"
          radius="lg"
          size="md"
          onPress={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export const ES_NoContacts: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <EmptyState
    icon="📇"
    title="No hay contactos"
    description="Comienza agregando tu primer contacto para gestionar tus relaciones comerciales"
    actionLabel="Crear primer contacto"
    onAction={onAction}
  />
);

export const ES_NoDeals: React.FC<{ onAction: () => void }> = ({ onAction }) => (
  <EmptyState
    icon="💼"
    title="No hay negocios"
    description="Crea tu primer negocio para comenzar a gestionar tu pipeline de ventas"
    actionLabel="Crear primer negocio"
    onAction={onAction}
  />
); 