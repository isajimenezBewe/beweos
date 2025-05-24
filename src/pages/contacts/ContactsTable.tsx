import React, { useState, useMemo } from 'react';
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
import { motion } from 'framer-motion';
import { useContacts } from '@/contexts/ContactsContext';
import { StatusBadge } from '@/components/shared/Badge';
import { ES_NoContacts } from '@/components/shared/EmptyState';
import { M_CSVLimit } from '@/components/shared/CSVLimitModal';
import { ContactDetail } from './ContactDetail';
import { NewContactWizard } from './NewContactWizard';

export const ContactsTable: React.FC = () => {
  const { contacts } = useContacts();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showNewContact, setShowNewContact] = useState(false);
  const [showCSVLimit, setShowCSVLimit] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    if (searchValue) {
      filtered = filtered.filter(contact =>
        contact.nombre.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        contact.empresa.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(contact => contact.estado === statusFilter);
    }

    if (tagFilter) {
      filtered = filtered.filter(contact => contact.etiquetas.includes(tagFilter));
    }

    return filtered;
  }, [contacts, searchValue, statusFilter, tagFilter]);

  const handleExportCSV = () => {
    if (filteredContacts.length > 1000) {
      setShowCSVLimit(true);
      return;
    }
    // Export logic here
    console.log('Exporting CSV...');
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach(contact => contact.etiquetas.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [contacts]);

  if (contacts.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <ES_NoContacts onAction={() => setShowNewContact(true)} />
        <NewContactWizard
          isOpen={showNewContact}
          onClose={() => setShowNewContact(false)}
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
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">Contactos</h1>
          
          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 w-full lg:w-auto">
              {/* Search */}
              <Input
                placeholder="Buscar contactos..."
                value={searchValue}
                onValueChange={setSearchValue}
                startContent={<span>🔍</span>}
                radius="lg"
                classNames={{
                  base: "w-full sm:max-w-xs",
                  inputWrapper: "bg-gray-100 border-gray-200 hover:bg-gray-200"
                }}
              />

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat" radius="lg" size="sm" className="sm:size-md">
                      Estado {statusFilter && `(${statusFilter})`}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    selectedKeys={statusFilter ? [statusFilter] : []}
                    onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string || null)}
                    selectionMode="single"
                  >
                    <DropdownItem key="activo">Activo</DropdownItem>
                    <DropdownItem key="inactivo">Inactivo</DropdownItem>
                    <DropdownItem key="pendiente">Pendiente</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat" radius="lg" size="sm" className="sm:size-md">
                      Etiqueta {tagFilter && `(${tagFilter})`}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    selectedKeys={tagFilter ? [tagFilter] : []}
                    onSelectionChange={(keys) => setTagFilter(Array.from(keys)[0] as string || null)}
                    selectionMode="single"
                  >
                    {allTags.map(tag => (
                      <DropdownItem key={tag}>{tag}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                {(statusFilter || tagFilter) && (
                  <Button
                    variant="light"
                    size="sm"
                    onPress={() => {
                      setStatusFilter(null);
                      setTagFilter(null);
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="light"
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
                onPress={() => setShowNewContact(true)}
              >
                Nuevo contacto
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile and Tablet Cards View (hidden on lg and above) */}
        <div className="flex-1 overflow-auto lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                isPressable
                onPress={() => setSelectedContactId(contact.id)}
                className="bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{contact.nombre}</h3>
                      <p className="text-sm text-gray-500 truncate">{contact.empresa}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <StatusBadge status={contact.estado} />
                      {contact.impago && (
                        <Chip color="danger" size="sm" variant="flat" radius="md">
                          Impago
                        </Chip>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📧</span>
                      <span className="text-gray-600 truncate flex-1">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📱</span>
                      <span className="text-gray-600">{contact.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span className="text-gray-600">
                        Últ. actividad: {contact.ultimaActividad.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {contact.etiquetas.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {contact.etiquetas.map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat" radius="md">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop Table View (visible on lg and above) */}
        <div className="flex-1 overflow-hidden hidden lg:block">
          <Table
            aria-label="Tabla de contactos"
            classNames={{
              base: "max-h-full",
              wrapper: "bg-white rounded-2xl shadow-soft max-h-full overflow-auto",
              th: "bg-gray-50 text-gray-600 font-medium text-sm",
              td: "text-gray-900 text-sm",
              table: "min-w-full"
            }}
            selectionMode="single"
            onRowAction={(key) => setSelectedContactId(key as string)}
          >
            <TableHeader>
              <TableColumn minWidth={150}>Nombre</TableColumn>
              <TableColumn minWidth={120}>Empresa</TableColumn>
              <TableColumn minWidth={100}>Estado</TableColumn>
              <TableColumn minWidth={120}>Últ. actividad</TableColumn>
              <TableColumn minWidth={120}>Teléfono</TableColumn>
              <TableColumn minWidth={200}>Email</TableColumn>
              <TableColumn minWidth={150}>Etiquetas</TableColumn>
              <TableColumn minWidth={80}>⚠️</TableColumn>
            </TableHeader>
            <TableBody items={filteredContacts}>
              {(contact) => (
                <TableRow key={contact.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell className="font-medium">{contact.nombre}</TableCell>
                  <TableCell>{contact.empresa}</TableCell>
                  <TableCell>
                    <StatusBadge status={contact.estado} />
                  </TableCell>
                  <TableCell>
                    {contact.ultimaActividad.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{contact.telefono}</TableCell>
                  <TableCell>
                    <p className="truncate max-w-[200px]" title={contact.email}>
                      {contact.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {contact.etiquetas.slice(0, 3).map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat" radius="md">
                          {tag}
                        </Chip>
                      ))}
                      {contact.etiquetas.length > 3 && (
                        <Chip size="sm" variant="flat" radius="md">
                          +{contact.etiquetas.length - 3}
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.impago && (
                      <Chip color="danger" size="sm" variant="flat" radius="md">
                        Impago
                      </Chip>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Contact count */}
        <div className="mt-3 md:mt-4 text-xs sm:text-sm text-gray-500">
          Mostrando {filteredContacts.length} de {contacts.length} contactos
        </div>
      </motion.div>

      {/* Contact Detail Panel */}
      <ContactDetail
        contactId={selectedContactId}
        onClose={() => setSelectedContactId(null)}
      />

      {/* New Contact Wizard */}
      <NewContactWizard
        isOpen={showNewContact}
        onClose={() => setShowNewContact(false)}
      />

      {/* CSV Limit Modal */}
      <M_CSVLimit
        isOpen={showCSVLimit}
        onClose={() => setShowCSVLimit(false)}
        rowCount={filteredContacts.length}
      />
    </>
  );
}; 