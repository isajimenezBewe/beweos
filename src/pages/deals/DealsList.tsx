import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Card, CardBody } from '@heroui/card';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDeals, DealStage } from '@/contexts/DealsContext';
import { useContacts } from '@/contexts/ContactsContext';
import { StageBadge } from '@/components/shared/Badge';
import { ES_NoDeals } from '@/components/shared/EmptyState';
import { M_CSVLimit } from '@/components/shared/CSVLimitModal';
import { DealDetail } from './DealDetail';
import { NewDealModal } from './NewDealModal';

export const DealsList: React.FC = () => {
  const { deals, changeStage } = useDeals();
  const { getContactById } = useContacts();
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [showCSVLimit, setShowCSVLimit] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if screen is desktop size to conditionally render table
  useEffect(() => {
    const checkScreenSize = () => {
      // lg breakpoint is 1024px in Tailwind
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

    if (stageFilter) {
      filtered = filtered.filter(deal => deal.etapa === stageFilter);
    }

    return filtered;
  }, [deals, searchValue, planFilter, stageFilter]);

  const handleExportCSV = () => {
    if (filteredDeals.length > 1000) {
      setShowCSVLimit(true);
      return;
    }
    console.log('Exporting CSV...');
  };

  const stageOptions: { key: DealStage; label: string }[] = [
    { key: 'lead', label: 'Lead' },
    { key: 'prospecto', label: 'Prospecto' },
    { key: 'cliente_ganado', label: 'Cliente Ganado' },
    { key: 'cliente_perdido', label: 'Cliente Perdido' },
  ];

  const getStageColorClasses = (stage: DealStage) => {
    const colors = {
      lead: 'bg-default-100 text-default-700',
      prospecto: 'bg-primary-100 text-primary-700',
      cliente_ganado: 'bg-success-100 text-success-700',
      cliente_perdido: 'bg-danger-100 text-danger-700'
    };
    return colors[stage];
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
        className="h-full flex flex-col p-3 sm:p-4 md:p-6"
      >
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Negocios</h1>
            </div>
          </div>
          
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 w-full lg:w-auto">
              {/* View Toggle */}
              <div className="flex bg-content2 rounded-2xl p-1">
                <Button
                  size="sm"
                  variant="light"
                  radius="lg"
                  as={Link}
                  to="/deals"
                  className=""
                >
                  <span className="text-sm">⚏</span>
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  radius="lg"
                  className="bg-content1 shadow-sm"
                >
                  <span className="text-sm">☰</span>
                </Button>
              </div>

              {/* Search */}
              <Input
                placeholder="Buscar negocios..."
                value={searchValue}
                onValueChange={setSearchValue}
                startContent={<span>🔍</span>}
                radius="lg"
                classNames={{
                  base: "w-full sm:max-w-xs",
                  inputWrapper: "bg-content2 border-divider hover:bg-content3"
                }}
              />

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat" radius="lg" size="sm" className="sm:size-md">
                      Estado {stageFilter && `(${stageFilter})`}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    selectedKeys={stageFilter ? [stageFilter] : []}
                    onSelectionChange={(keys) => setStageFilter(Array.from(keys)[0] as string || null)}
                    selectionMode="single"
                  >
                    <DropdownItem key="lead">Lead</DropdownItem>
                    <DropdownItem key="prospecto">Prospecto</DropdownItem>
                    <DropdownItem key="cliente_ganado">Cliente Ganado</DropdownItem>
                    <DropdownItem key="cliente_perdido">Cliente Perdido</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat" radius="lg" size="sm" className="sm:size-md">
                      Plan {planFilter && `(${planFilter})`}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    selectedKeys={planFilter ? [planFilter] : []}
                    onSelectionChange={(keys) => setPlanFilter(Array.from(keys)[0] as string || null)}
                    selectionMode="single"
                  >
                    <DropdownItem key="Starter">Starter</DropdownItem>
                    <DropdownItem key="Growth">Growth</DropdownItem>
                    <DropdownItem key="Enterprise">Enterprise</DropdownItem>
                    <DropdownItem key="Custom">Custom</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                {(planFilter || stageFilter) && (
                  <Button
                    variant="light"
                    size="sm"
                    onPress={() => {
                      setPlanFilter(null);
                      setStageFilter(null);
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="flat"
                radius="lg"
                size="sm"
                className="hidden sm:flex sm:size-md"
                startContent={<span>📤</span>}
                onPress={handleExportCSV}
              >
                Exportar CSV
              </Button>
              <Button
                color="primary"
                radius="lg"
                size="sm"
                className="w-full sm:w-auto sm:size-md"
                startContent={<span>+</span>}
                onPress={() => setShowNewDeal(true)}
              >
                Nuevo negocio
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile and Tablet Cards View (hidden on lg and above) */}
        <div className="flex-1 overflow-auto lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {filteredDeals.map((deal) => {
              const contact = getContactById(deal.contactoId);
              
              return (
                <Card
                  key={deal.id}
                  isPressable
                  onPress={() => setSelectedDealId(deal.id)}
                  className="bg-content1 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{deal.nombreNegocio}</h3>
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
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        radius="full"
                        className={`${getStageColorClasses(deal.etapa)} border-0 px-2 py-1 text-xs ml-2`}
                      >
                        {stageOptions.find(s => s.key === deal.etapa)?.label}
                      </Chip>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-default-400">💰</span>
                          <span className="font-semibold text-foreground">€{deal.mrr.toLocaleString()}/mes</span>
                        </div>
                        <Chip size="sm" variant="flat" radius="md">
                          {deal.plan}
                        </Chip>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-default-400">📅</span>
                        <span className="text-default-600">
                          Últ. actividad: {deal.ultimaActividad.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {deal.trial && (
                        <Chip 
                          size="sm" 
                          variant="flat"
                          radius="full"
                          className="bg-secondary-100 text-secondary-700 text-xs"
                        >
                          <span className="mr-1">🏷</span>
                          Trial
                        </Chip>
                      )}
                      {deal.impago && (
                        <Chip color="danger" size="sm" variant="flat" radius="md">
                          Impago
                        </Chip>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desktop Table View (conditionally rendered based on state) */}
        {isDesktop && (
          <div className="flex-1">
            <Table
              aria-label="Tabla de negocios"
              selectionMode="single"
              onRowAction={(key) => setSelectedDealId(key as string)}
            >
              <TableHeader>
                <TableColumn minWidth={150}>Nombre negocio</TableColumn>
                <TableColumn minWidth={120}>Contacto</TableColumn>
                <TableColumn minWidth={120}>Etapa</TableColumn>
                <TableColumn minWidth={100}>Plan</TableColumn>
                <TableColumn minWidth={100}>MRR</TableColumn>
                <TableColumn minWidth={80}>⚠️</TableColumn>
                <TableColumn minWidth={80}>🏷</TableColumn>
                <TableColumn minWidth={120}>Últ. actividad</TableColumn>
              </TableHeader>
              <TableBody items={filteredDeals}>
                {(deal) => {
                  const contact = getContactById(deal.contactoId);
                  
                  return (
                    <TableRow key={deal.id} className="cursor-pointer hover:bg-content2">
                      <TableCell className="font-medium">{deal.nombreNegocio}</TableCell>
                      <TableCell>
                        {contact && (
                          <Link 
                            to={`/contacts/${contact.id}`}
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contact.nombre}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          aria-label="Etapa"
                          selectedKeys={[deal.etapa]}
                          onSelectionChange={(keys) => {
                            changeStage(deal.id, Array.from(keys)[0] as DealStage);
                          }}
                          size="sm"
                          radius="md"
                          classNames={{
                            trigger: "min-h-unit-8 h-8",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {stageOptions.map(option => (
                            <SelectItem key={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" radius="md">
                          {deal.plan}
                        </Chip>
                      </TableCell>
                      <TableCell className="font-semibold">
                        €{deal.mrr.toLocaleString()}/mes
                      </TableCell>
                      <TableCell>
                        {deal.impago && (
                          <Chip color="danger" size="sm" variant="flat" radius="md">
                            Impago
                          </Chip>
                        )}
                      </TableCell>
                      <TableCell>
                        {deal.trial && (
                          <Chip color="secondary" size="sm" variant="flat" radius="md">
                            Trial
                          </Chip>
                        )}
                      </TableCell>
                      <TableCell>{deal.ultimaActividad.toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Deal count */}
        <div className="mt-3 md:mt-4 text-xs sm:text-sm text-default-500">
          Mostrando {filteredDeals.length} de {deals.length} negocios
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