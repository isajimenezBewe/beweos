import React from 'react';
import { Chip, ChipProps } from '@heroui/chip';

interface BadgeProps extends Omit<ChipProps, 'variant'> {
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const variantColors = {
    success: 'success',
    warning: 'warning', 
    danger: 'danger',
    primary: 'primary',
    secondary: 'secondary',
    default: 'default'
  };

  return (
    <Chip
      color={variantColors[variant] as ChipProps['color']}
      size="sm"
      radius="md"
      className={`${className}`}
      {...props}
    />
  );
};

// Specific badge components
export const StatusBadge: React.FC<{ status: 'activo' | 'inactivo' | 'pendiente' }> = ({ status }) => {
  const config = {
    activo: { color: 'success', label: 'Activo' },
    inactivo: { color: 'default', label: 'Inactivo' },
    pendiente: { color: 'warning', label: 'Pendiente' }
  };

  return (
    <Chip
      color={config[status].color as ChipProps['color']}
      size="sm"
      radius="md"
      variant="flat"
    >
      {config[status].label}
    </Chip>
  );
};

export const StageBadge: React.FC<{ stage: string }> = ({ stage }) => {
  const stageConfig = {
    lead: { color: 'primary', label: 'Lead' },
    prospecto: { color: 'secondary', label: 'Prospecto' },
    cliente_ganado: { color: 'success', label: 'Cliente Ganado' },
    cliente_perdido: { color: 'danger', label: 'Cliente Perdido' }
  };

  const config = stageConfig[stage as keyof typeof stageConfig] || { color: 'default', label: stage };

  return (
    <Chip
      color={config.color as ChipProps['color']}
      size="sm"
      radius="md"
      variant="flat"
    >
      {config.label}
    </Chip>
  );
}; 