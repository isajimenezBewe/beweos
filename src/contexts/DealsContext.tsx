import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DealStage = 'lead' | 'prospecto' | 'cliente_ganado' | 'cliente_perdido';

export interface Deal {
  id: string;
  nombreNegocio: string;
  contactoId: string;
  etapa: DealStage;
  plan: 'Starter' | 'Growth' | 'Enterprise' | 'Custom';
  mrr: number;
  trial: boolean;
  impago: boolean;
  etiquetas: string[];
  ultimaActividad: Date;
  integraciones: {
    googleAnalytics: boolean;
    metaAds: boolean;
    googleAds: boolean;
  };
  modulosActivos: string[];
  healthScore: number;
}

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'ultimaActividad' | 'healthScore'>) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  getDealById: (id: string) => Deal | undefined;
  getDealsByContactId: (contactId: string) => Deal[];
  changeStage: (id: string, stage: DealStage) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

// Mockup data
const initialDeals: Deal[] = [
  {
    id: '1',
    nombreNegocio: 'Proyecto Web Tech Solutions',
    contactoId: '1',
    etapa: 'prospecto',
    plan: 'Growth',
    mrr: 999,
    trial: true,
    impago: false,
    etiquetas: ['Prioritario', 'Q1 2024'],
    ultimaActividad: new Date('2024-01-15'),
    integraciones: {
      googleAnalytics: true,
      metaAds: true,
      googleAds: false,
    },
    modulosActivos: ['Bewe OS', 'Analytics Dashboard', 'SEO Tools'],
    healthScore: 85,
  },
  {
    id: '2',
    nombreNegocio: 'Campaña Digital StartupIO',
    contactoId: '2',
    etapa: 'lead',
    plan: 'Starter',
    mrr: 299,
    trial: false,
    impago: true,
    etiquetas: ['Nuevo'],
    ultimaActividad: new Date('2024-01-14'),
    integraciones: {
      googleAnalytics: true,
      metaAds: false,
      googleAds: false,
    },
    modulosActivos: ['Bewe OS'],
    healthScore: 60,
  },
  {
    id: '3',
    nombreNegocio: 'Transformación Digital Corp',
    contactoId: '3',
    etapa: 'cliente_perdido',
    plan: 'Enterprise',
    mrr: 2999,
    trial: false,
    impago: false,
    etiquetas: ['Enterprise', 'Pérdida Q4'],
    ultimaActividad: new Date('2024-01-10'),
    integraciones: {
      googleAnalytics: true,
      metaAds: true,
      googleAds: true,
    },
    modulosActivos: ['Bewe OS', 'Analytics Dashboard', 'SEO Tools', 'Marketing Automation'],
    healthScore: 20,
  },
  {
    id: '4',
    nombreNegocio: 'Rediseño Web Agency',
    contactoId: '4',
    etapa: 'cliente_ganado',
    plan: 'Growth',
    mrr: 799,
    trial: false,
    impago: false,
    etiquetas: ['Activo', 'Satisfecho'],
    ultimaActividad: new Date('2024-01-12'),
    integraciones: {
      googleAnalytics: true,
      metaAds: true,
      googleAds: false,
    },
    modulosActivos: ['Bewe OS', 'Analytics Dashboard'],
    healthScore: 95,
  },
  {
    id: '5',
    nombreNegocio: 'E-commerce Solutions',
    contactoId: '1',
    etapa: 'lead',
    plan: 'Custom',
    mrr: 1500,
    trial: true,
    impago: false,
    etiquetas: ['E-commerce', 'Personalizado'],
    ultimaActividad: new Date('2024-01-13'),
    integraciones: {
      googleAnalytics: true,
      metaAds: false,
      googleAds: true,
    },
    modulosActivos: ['Bewe OS', 'E-commerce Module'],
    healthScore: 75,
  },
];

export const DealsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  const addDeal = (dealData: Omit<Deal, 'id' | 'ultimaActividad' | 'healthScore'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: Date.now().toString(),
      ultimaActividad: new Date(),
      healthScore: 70, // Default health score
    };
    setDeals([...deals, newDeal]);
  };

  const updateDeal = (id: string, dealData: Partial<Deal>) => {
    setDeals(deals.map(deal => 
      deal.id === id ? { ...deal, ...dealData } : deal
    ));
  };

  const deleteDeal = (id: string) => {
    setDeals(deals.filter(deal => deal.id !== id));
  };

  const getDealById = (id: string) => {
    return deals.find(deal => deal.id === id);
  };

  const getDealsByContactId = (contactId: string) => {
    return deals.filter(deal => deal.contactoId === contactId);
  };

  const changeStage = (id: string, stage: DealStage) => {
    updateDeal(id, { etapa: stage, ultimaActividad: new Date() });
    // Emit event for stage change (in a real app, this would trigger other actions)
    console.log(`Deal ${id} stage changed to ${stage}`);
  };

  return (
    <DealsContext.Provider value={{
      deals,
      addDeal,
      updateDeal,
      deleteDeal,
      getDealById,
      getDealsByContactId,
      changeStage,
    }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (!context) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
}; 