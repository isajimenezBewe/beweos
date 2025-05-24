import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Tabs, Tab } from '@heroui/tabs';
import { Avatar } from '@heroui/avatar';
import { Chip } from '@heroui/chip';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table';
import { useContacts } from '@/contexts/ContactsContext';
import { useDeals } from '@/contexts/DealsContext';
import { StatusBadge } from '@/components/shared/Badge';

interface ContactDetailProps {
  contactId: string | null;
  onClose: () => void;
  fromDeal?: boolean;
  dealName?: string;
}

export const ContactDetail: React.FC<ContactDetailProps> = ({ 
  contactId, 
  onClose,
  fromDeal = false,
  dealName
}) => {
  const { getContactById, updateContact } = useContacts();
  const { getDealsByContactId } = useDeals();
  const [isEditing, setIsEditing] = useState(false);
  
  const contact = contactId ? getContactById(contactId) : null;
  const contactDeals = contactId ? getDealsByContactId(contactId) : [];
  
  const [editedData, setEditedData] = useState({
    nombre: contact?.nombre || '',
    telefono: contact?.telefono || '',
    empresa: contact?.empresa || '',
  });

  if (!contact) return null;

  const handleSave = () => {
    updateContact(contact.id, editedData);
    setIsEditing(false);
  };

  const slideVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' }
  };

  return (
    <AnimatePresence>
      {contact && (
        <motion.div
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-soft-lg z-40 flex flex-col"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            {fromDeal && dealName && (
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <span>{dealName}</span>
                <span>›</span>
                <span>Contacto</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  name={contact.nombre}
                  size="lg"
                  color="primary"
                  className="text-white"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{contact.nombre}</h2>
                  <StatusBadge status={contact.estado} />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" radius="lg">
                      ⋮
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem key="edit" onPress={() => setIsEditing(!isEditing)}>
                      {isEditing ? 'Cancelar edición' : 'Editar'}
                    </DropdownItem>
                    <DropdownItem key="delete" className="text-danger" color="danger">
                      Eliminar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <Tabs aria-label="Opciones" className="px-6 pt-4">
              <Tab key="info" title="Información">
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm text-gray-500">Nombre</label>
                    {isEditing ? (
                      <Input
                        value={editedData.nombre}
                        onValueChange={(value) => setEditedData({ ...editedData, nombre: value })}
                        radius="lg"
                        size="sm"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-900">{contact.email}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Teléfono</label>
                    {isEditing ? (
                      <Input
                        value={editedData.telefono}
                        onValueChange={(value) => setEditedData({ ...editedData, telefono: value })}
                        radius="lg"
                        size="sm"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.telefono}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Empresa</label>
                    {isEditing ? (
                      <Input
                        value={editedData.empresa}
                        onValueChange={(value) => setEditedData({ ...editedData, empresa: value })}
                        radius="lg"
                        size="sm"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.empresa}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Etiquetas</label>
                    <div className="flex gap-1 mt-1">
                      {contact.etiquetas.map((tag, index) => (
                        <Chip key={index} size="sm" variant="flat" radius="md">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        color="primary"
                        radius="lg"
                        onPress={handleSave}
                      >
                        Guardar cambios
                      </Button>
                      <Button
                        variant="light"
                        radius="lg"
                        onPress={() => {
                          setIsEditing(false);
                          setEditedData({
                            nombre: contact.nombre,
                            telefono: contact.telefono,
                            empresa: contact.empresa,
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </Tab>

              <Tab key="deals" title="Negocios vinculados">
                <div className="py-4">
                  {contactDeals.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No hay negocios vinculados
                    </p>
                  ) : (
                    <Table
                      aria-label="Negocios vinculados"
                      classNames={{
                        wrapper: "shadow-none",
                        th: "bg-gray-50 text-gray-600 font-medium text-xs",
                        td: "text-sm"
                      }}
                    >
                      <TableHeader>
                        <TableColumn>Negocio</TableColumn>
                        <TableColumn>Plan</TableColumn>
                        <TableColumn>MRR</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {contactDeals.map((deal) => (
                          <TableRow key={deal.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell>{deal.nombreNegocio}</TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat" radius="md">
                                {deal.plan}
                              </Chip>
                            </TableCell>
                            <TableCell>€{deal.mrr}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </Tab>

              <Tab key="timeline" title="Timeline IA">
                <div className="py-4">
                  <p className="text-gray-500 text-center py-8">
                    Timeline de actividades (IA) próximamente
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