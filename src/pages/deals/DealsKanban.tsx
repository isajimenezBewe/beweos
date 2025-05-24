import React, { useState, useMemo } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Input } from '@heroui/input';
import { motion } from 'framer-motion';
import { useDeals, DealStage } from '@/contexts/DealsContext';
import { useContacts } from '@/contexts/ContactsContext';
import { StageBadge } from '@/components/shared/Badge';
import { ES_NoDeals } from '@/components/shared/EmptyState';
import { M_CSVLimit } from '@/components/shared/CSVLimitModal';
import { DealDetail } from './DealDetail';
import { NewDealModal } from './NewDealModal';
import { Link } from 'react-router-dom';

const stageColumns: { key: DealStage; title: string; color: string; bgColor: string }[] = [
  { key: 'lead', title: 'Lead', color: 'text-gray-800', bgColor: 'bg-gray-100' },
  { key: 'prospecto', title: 'Prospecto', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  { key: 'cliente_ganado', title: 'Cliente Ganado', color: 'text-green-800', bgColor: 'bg-green-100' },
  { key: 'cliente_perdido', title: 'Cliente Perdido', color: 'text-red-800', bgColor: 'bg-red-100' },
];

export const DealsKanban: React.FC = () => {
  const { deals, changeStage } = useDeals();
  const { getContactById } = useContacts();
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showCSVLimit, setShowCSVLimit] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  // Filter deals
  const filteredDeals = useMemo(() => {
    let filtered = deals;

    if (searchValue) {
      filtered = filtered.filter(deal =>
        deal.nombreNegocio.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (planFilter) {
      filtered = filtered.filter(deal => deal.plan === planFilter);
    }

    return filtered;
  }, [deals, searchValue, planFilter]);

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, typeof deals> = {
      lead: [],
      prospecto: [],
      cliente_ganado: [],
      cliente_perdido: [],
    };

    filteredDeals.forEach(deal => {
      grouped[deal.etapa].push(deal);
    });

    return grouped;
  }, [filteredDeals]);

  const handleExportCSV = () => {
    if (filteredDeals.length > 1000) {
      setShowCSVLimit(true);
      return;
    }
    console.log('Exporting CSV...');
  };

  const getStageColorClasses = (stage: DealStage) => {
    const colors = {
      lead: 'bg-gray-100 text-gray-800',
      prospecto: 'bg-blue-100 text-blue-800',
      cliente_ganado: 'bg-green-100 text-green-800',
      cliente_perdido: 'bg-red-100 text-red-800'
    };
    return colors[stage];
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '';
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => {
    e.preventDefault();
    
    if (draggedDealId) {
      changeStage(draggedDealId, stage);
      setDraggedDealId(null);
      setDragOverStage(null);
    }
  };

  if (deals.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <ES_NoDeals onAction={() => setShowNewDeal(true)} />
        <NewDealModal
          isOpen={showNewDeal}
          onClose={() => setShowNewDeal(false)}
        />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col p-6"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <h1 className="text-xl font-semibold text-gray-900">Negocios</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'kanban' ? 'solid' : 'light'}
                  onPress={() => setViewMode('kanban')}
                  radius="lg"
                  className={viewMode === 'kanban' ? 'bg-white shadow-sm' : ''}
                >
                  <span className="text-sm">⚏</span>
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'solid' : 'light'}
                  onPress={() => setViewMode('list')}
                  radius="lg"
                  as={Link}
                  to="/deals/list"
                  className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
                >
                  <span className="text-sm">☰</span>
                </Button>
              </div>

              {/* Filters */}
              <Button 
                variant="flat" 
                radius="lg"
                size="sm"
                startContent={<span>🎯</span>}
              >
                Filtros
              </Button>

              {/* Export */}
              <Button
                variant="flat"
                radius="lg"
                size="sm"
                startContent={<span>📤</span>}
                onPress={handleExportCSV}
              >
                Exportar CSV
              </Button>

              {/* New Deal */}
              <Button
                color="primary"
                radius="lg"
                size="sm"
                startContent={<span>+</span>}
                onPress={() => setShowNewDeal(true)}
              >
                Nuevo negocio
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-w-max lg:min-w-0">
            {stageColumns.map(column => (
              <div 
                key={column.key} 
                className="min-w-[320px] lg:min-w-0"
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.key)}
              >
                {/* Column Header */}
                <div className={`rounded-2xl p-4 mb-4 ${column.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${column.color}`}>{column.title}</h3>
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      className="bg-white/70 text-gray-700"
                    >
                      {dealsByStage[column.key].length}
                    </Chip>
                  </div>
                </div>

                {/* Drop Zone */}
                <div 
                  className={`space-y-4 min-h-[200px] p-2 rounded-2xl transition-all ${
                    dragOverStage === column.key 
                      ? 'bg-primary/10 border-2 border-dashed border-primary' 
                      : ''
                  }`}
                >
                  {dealsByStage[column.key].map(deal => {
                    const contact = getContactById(deal.contactoId);
                    
                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        onDragEnd={handleDragEnd}
                        className="cursor-move"
                      >
                        <Card
                          isPressable
                          onPress={() => setSelectedDealId(deal.id)}
                          classNames={{
                            base: `shadow-sm hover:shadow-md transition-all rounded-2xl border-0 ${
                              draggedDealId === deal.id ? 'opacity-50' : ''
                            }`
                          }}
                        >
                          <CardBody className="p-4 space-y-3">
                            {/* Deal Name and Menu */}
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                {deal.nombreNegocio}
                              </h4>
                              <Dropdown>
                                <DropdownTrigger>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    radius="full"
                                    className="min-w-unit-6 w-unit-6 h-unit-6"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="text-gray-400">⋯</span>
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => changeStage(deal.id, key as DealStage)}>
                                  <DropdownItem key="lead">Cambiar a Lead</DropdownItem>
                                  <DropdownItem key="prospecto">Cambiar a Prospecto</DropdownItem>
                                  <DropdownItem key="cliente_ganado">Cambiar a Cliente Ganado</DropdownItem>
                                  <DropdownItem key="cliente_perdido">Cambiar a Cliente Perdido</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>

                            {/* Contact Link */}
                            {contact && (
                              <button
                                type="button"
                                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 cursor-pointer bg-transparent border-none p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to contact
                                }}
                              >
                                <span className="text-xs">🔗</span>
                                <span>{contact.nombre}</span>
                              </button>
                            )}

                            {/* Plan and MRR */}
                            <div className="flex items-center justify-between">
                              <Chip
                                size="sm"
                                variant="flat"
                                radius="full"
                                className={`${getStageColorClasses(deal.etapa)} border-0 px-2 py-1 text-xs`}
                              >
                                {deal.plan}
                              </Chip>
                              <span className="font-semibold text-gray-900 text-sm">
                                €{deal.mrr.toLocaleString()}
                              </span>
                            </div>

                            {/* Badges and Stage */}
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {deal.trial && (
                                  <Chip 
                                    size="sm" 
                                    variant="flat"
                                    radius="full"
                                    className="bg-purple-100 text-purple-800 text-xs"
                                  >
                                    <span className="mr-1">🏷</span>
                                    Trial
                                  </Chip>
                                )}
                                {deal.impago && (
                                  <span className="text-red-500 text-sm">⚠️</span>
                                )}
                              </div>
                              <Chip
                                size="sm"
                                variant="flat"
                                radius="full"
                                className={`${getStageColorClasses(deal.etapa)} border-0 px-2 py-1 text-xs`}
                              >
                                {column.title}
                              </Chip>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                    );
                  })}
                  
                  {/* Empty state for columns */}
                  {dealsByStage[column.key].length === 0 && (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                      {dragOverStage === column.key ? (
                        <span>Suelta aquí para mover</span>
                      ) : (
                        <span>Sin negocios</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Deal Detail Panel */}
      <DealDetail
        dealId={selectedDealId}
        onClose={() => setSelectedDealId(null)}
      />

      {/* New Deal Modal */}
      <NewDealModal
        isOpen={showNewDeal}
        onClose={() => setShowNewDeal(false)}
      />

      {/* CSV Limit Modal */}
      <M_CSVLimit
        isOpen={showCSVLimit}
        onClose={() => setShowCSVLimit(false)}
        rowCount={filteredDeals.length}
      />
    </>
  );
}; 