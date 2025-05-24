import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/button';
import { Tabs, Tab } from '@heroui/tabs';
import { Chip } from '@heroui/chip';
import { Select, SelectItem } from '@heroui/select';
import { Card, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Link } from 'react-router-dom';
import { useDeals, DealStage } from '@/contexts/DealsContext';
import { useContacts } from '@/contexts/ContactsContext';
import { StageBadge } from '@/components/shared/Badge';

interface DealDetailProps {
  dealId: string | null;
  onClose: () => void;
}

export const DealDetail: React.FC<DealDetailProps> = ({ dealId, onClose }) => {
  const { getDealById, changeStage } = useDeals();
  const { getContactById } = useContacts();
  const [isAdmin] = useState(true); // Simulating admin role
  
  const deal = dealId ? getDealById(dealId) : null;
  const contact = deal ? getContactById(deal.contactoId) : null;

  if (!deal || !contact) return null;

  const slideVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' }
  };

  const stageOptions: { key: DealStage; label: string }[] = [
    { key: 'lead', label: 'Lead' },
    { key: 'prospecto', label: 'Prospecto' },
    { key: 'cliente_ganado', label: 'Cliente Ganado' },
    { key: 'cliente_perdido', label: 'Cliente Perdido' },
  ];

  return (
    <AnimatePresence>
      {deal && (
        <motion.div
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-soft-lg z-40 flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
              <Link to={`/contacts/${contact.id}`} className="hover:text-primary">
                {contact.nombre}
              </Link>
              <span>›</span>
              <span>Negocio</span>
            </div>
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{deal.nombreNegocio}</h2>
              
              <Button
                isIconOnly
                variant="light"
                radius="lg"
                onPress={onClose}
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Summary Info */}
          <div className="p-6 space-y-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plan</p>
                <Chip size="md" variant="flat" radius="md">{deal.plan}</Chip>
              </div>
              <div>
                <p className="text-sm text-gray-500">MRR</p>
                <p className="font-semibold text-lg">€{deal.mrr.toLocaleString()}/mes</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Etapa</p>
              {isAdmin ? (
                <Select
                  selectedKeys={[deal.etapa]}
                  onSelectionChange={(keys) => changeStage(deal.id, Array.from(keys)[0] as DealStage)}
                  radius="lg"
                  size="sm"
                >
                  {stageOptions.map(option => (
                    <SelectItem key={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                <StageBadge stage={deal.etapa} />
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {deal.trial && (
                <Chip size="sm" color="secondary" variant="flat" radius="md">
                  🏷 Trial
                </Chip>
              )}
              {deal.impago && (
                <Chip size="sm" color="danger" variant="flat" radius="md">
                  ⚠️ Impago
                </Chip>
              )}
            </div>

            <Divider />

            <div>
              <p className="text-sm text-gray-500 mb-2">Health Score</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      deal.healthScore >= 80 ? 'bg-green-500' :
                      deal.healthScore >= 60 ? 'bg-yellow-500' :
                      deal.healthScore >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${deal.healthScore}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{deal.healthScore}%</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 overflow-y-auto">
            <Tabs aria-label="Opciones" className="px-6 pt-4">
              <Tab key="products" title="Productos/Servicios">
                <div className="py-4 space-y-4">
                  <Card>
                    <CardBody>
                      <h4 className="font-medium mb-3">Módulos activos</h4>
                      <div className="flex flex-wrap gap-2">
                        {deal.modulosActivos.map((modulo, index) => (
                          <Chip key={index} size="sm" variant="flat" radius="md">
                            {modulo}
                          </Chip>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              <Tab key="integrations" title="Integraciones">
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Google Analytics</span>
                    <Chip 
                      size="sm" 
                      color={deal.integraciones.googleAnalytics ? 'success' : 'default'}
                      variant="flat"
                    >
                      {deal.integraciones.googleAnalytics ? 'Activo' : 'Inactivo'}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Meta Ads</span>
                    <Chip 
                      size="sm" 
                      color={deal.integraciones.metaAds ? 'success' : 'default'}
                      variant="flat"
                    >
                      {deal.integraciones.metaAds ? 'Activo' : 'Inactivo'}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Google Ads</span>
                    <Chip 
                      size="sm" 
                      color={deal.integraciones.googleAds ? 'success' : 'default'}
                      variant="flat"
                    >
                      {deal.integraciones.googleAds ? 'Activo' : 'Inactivo'}
                    </Chip>
                  </div>
                </div>
              </Tab>

              <Tab key="insights" title="AI Insights">
                <div className="py-4">
                  <p className="text-gray-500 text-center py-8">
                    Insights de IA próximamente
                  </p>
                </div>
              </Tab>

              <Tab key="timeline" title="Timeline">
                <div className="py-4">
                  <p className="text-gray-500 text-center py-8">
                    Timeline de actividades próximamente
                  </p>
                </div>
              </Tab>
            </Tabs>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 