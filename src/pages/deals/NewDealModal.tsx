import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Chip } from '@heroui/chip';
import { Checkbox } from '@heroui/checkbox';
import { Card, CardBody } from '@heroui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeals } from '@/contexts/DealsContext';
import { useContacts } from '@/contexts/ContactsContext';
import { useToast } from '@/components/shared/Toast';
import { StageBadge } from '@/components/shared/Badge';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableModules = [
  'Bewe OS',
  'Analytics Dashboard',
  'SEO Tools',
  'Marketing Automation',
  'E-commerce Module',
  'CRM Advanced',
  'Email Marketing',
  'Social Media Manager'
];

export const NewDealModal: React.FC<NewDealModalProps> = ({ isOpen, onClose }) => {
  const { addDeal } = useDeals();
  const { contacts, addContact } = useContacts();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [createNewContact, setCreateNewContact] = useState(false);
  
  const [formData, setFormData] = useState({
    nombreNegocio: '',
    contactoId: '',
    etapa: 'lead' as const,
    plan: 'Starter' as 'Starter' | 'Growth' | 'Enterprise' | 'Custom',
    mrr: 299,
    trial: false,
    impago: false,
    etiquetas: [] as string[],
    integraciones: {
      googleAnalytics: false,
      metaAds: false,
      googleAds: false,
    },
    modulosActivos: ['Bewe OS'],
  });

  const [newContactData, setNewContactData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const planPricing = {
    Starter: 299,
    Growth: 799,
    Enterprise: 2999,
    Custom: 0,
  };

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!createNewContact && !formData.contactoId) {
        newErrors.contactoId = 'Debes seleccionar un contacto';
      }
      if (createNewContact) {
        if (!newContactData.nombre) newErrors.nombre = 'El nombre es requerido';
        if (!newContactData.email) newErrors.email = 'El email es requerido';
        if (!newContactData.telefono) newErrors.telefono = 'El teléfono es requerido';
      }
    } else if (currentStep === 2) {
      if (!formData.nombreNegocio) newErrors.nombreNegocio = 'El nombre del negocio es requerido';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    let contactId = formData.contactoId;
    
    // Create new contact if needed
    if (createNewContact) {
      const newContact = {
        ...newContactData,
        estado: 'activo' as const,
        etiquetas: [],
        impago: false,
      };
      addContact(newContact);
      contactId = Date.now().toString(); // In real app, this would be returned by addContact
    }
    
         // Create deal
     addDeal({
       ...formData,
       contactoId: contactId,
       etiquetas: [],
     });
    
    showToast('Negocio creado exitosamente', 'success');
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nombreNegocio: '',
      contactoId: '',
      etapa: 'lead',
      plan: 'Starter',
      mrr: 299,
      trial: false,
      impago: false,
      etiquetas: [],
      integraciones: {
        googleAnalytics: false,
        metaAds: false,
        googleAds: false,
      },
      modulosActivos: ['Bewe OS'],
    });
    setNewContactData({
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
    });
    setErrors({});
    setCurrentStep(1);
    setCreateNewContact(false);
    onClose();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="3xl"
      radius="lg"
      classNames={{
        base: "bg-content1",
        header: "border-b border-divider",
        body: "py-6",
        footer: "border-t border-divider"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">Nuevo negocio</h3>
                <Chip size="sm" radius="full" variant="flat">
                  Paso {currentStep} de 3
                </Chip>
              </div>
            </ModalHeader>
            
            <ModalBody>
              <AnimatePresence mode="wait" custom={currentStep}>
                <motion.div
                  key={currentStep}
                  custom={currentStep}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium">Selecciona o crea un contacto</h4>
                      
                      {!createNewContact ? (
                        <>
                          <Select
                            label="Contacto existente"
                            placeholder="Selecciona un contacto"
                            selectedKeys={formData.contactoId ? [formData.contactoId] : []}
                            onSelectionChange={(keys) => setFormData({ ...formData, contactoId: Array.from(keys)[0] as string })}
                            isInvalid={!!errors.contactoId}
                            errorMessage={errors.contactoId}
                            radius="lg"
                          >
                            {contacts.map(contact => (
                              <SelectItem key={contact.id}>
                                {contact.nombre} - {contact.empresa}
                              </SelectItem>
                            ))}
                          </Select>
                          
                          <Button
                            variant="light"
                            onPress={() => setCreateNewContact(true)}
                            className="w-full"
                          >
                            Crear contacto rápido
                          </Button>
                        </>
                      ) : (
                        <Card>
                          <CardBody className="space-y-4">
                            <h5 className="font-medium">Crear contacto rápido</h5>
                            
                            <Input
                              label="Nombre"
                              placeholder="Nombre completo"
                              value={newContactData.nombre}
                              onValueChange={(value) => setNewContactData({ ...newContactData, nombre: value })}
                              isInvalid={!!errors.nombre}
                              errorMessage={errors.nombre}
                              radius="lg"
                            />
                            
                            <Input
                              label="Email"
                              placeholder="email@empresa.com"
                              type="email"
                              value={newContactData.email}
                              onValueChange={(value) => setNewContactData({ ...newContactData, email: value })}
                              isInvalid={!!errors.email}
                              errorMessage={errors.email}
                              radius="lg"
                            />
                            
                            <Input
                              label="Teléfono"
                              placeholder="+34 600 000 000"
                              value={newContactData.telefono}
                              onValueChange={(value) => setNewContactData({ ...newContactData, telefono: value })}
                              isInvalid={!!errors.telefono}
                              errorMessage={errors.telefono}
                              radius="lg"
                            />
                            
                            <Button
                              variant="light"
                              onPress={() => setCreateNewContact(false)}
                              size="sm"
                            >
                              Volver a contactos existentes
                            </Button>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  ) : currentStep === 2 ? (
                    <div className="space-y-4">
                      <Input
                        label="Nombre del negocio"
                        placeholder="Ej: Proyecto Web Empresa X"
                        value={formData.nombreNegocio}
                        onValueChange={(value) => setFormData({ ...formData, nombreNegocio: value })}
                        isInvalid={!!errors.nombreNegocio}
                        errorMessage={errors.nombreNegocio}
                        isRequired
                        radius="lg"
                      />
                      
                      <Select
                        label="Etapa inicial"
                        selectedKeys={[formData.etapa]}
                        onSelectionChange={(keys) => setFormData({ ...formData, etapa: Array.from(keys)[0] as any })}
                        radius="lg"
                      >
                        <SelectItem key="lead">Lead</SelectItem>
                        <SelectItem key="prospecto">Prospecto</SelectItem>
                        <SelectItem key="cliente_ganado">Cliente Ganado</SelectItem>
                      </Select>
                      
                      <Select
                        label="Plan"
                        selectedKeys={[formData.plan]}
                        onSelectionChange={(keys) => {
                          const plan = Array.from(keys)[0] as keyof typeof planPricing;
                          setFormData({ 
                            ...formData, 
                            plan: plan as any,
                            mrr: planPricing[plan] || 0
                          });
                        }}
                        radius="lg"
                      >
                        <SelectItem key="Starter">Starter - €299/mes</SelectItem>
                        <SelectItem key="Growth">Growth - €799/mes</SelectItem>
                        <SelectItem key="Enterprise">Enterprise - €2999/mes</SelectItem>
                        <SelectItem key="Custom">Custom - Precio personalizado</SelectItem>
                      </Select>
                      
                      {formData.plan === 'Custom' && (
                        <Input
                          label="MRR Personalizado"
                          placeholder="0"
                          type="number"
                          value={formData.mrr.toString()}
                          onValueChange={(value) => setFormData({ ...formData, mrr: parseInt(value) || 0 })}
                          startContent="€"
                          endContent="/mes"
                          radius="lg"
                        />
                      )}
                      
                      <Checkbox
                        isSelected={formData.trial}
                        onValueChange={(value) => setFormData({ ...formData, trial: value })}
                      >
                        Crear con periodo de prueba
                      </Checkbox>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Integraciones</p>
                        <Checkbox
                          isSelected={formData.integraciones.googleAnalytics}
                          onValueChange={(value) => setFormData({ 
                            ...formData, 
                            integraciones: { ...formData.integraciones, googleAnalytics: value }
                          })}
                        >
                          Google Analytics
                        </Checkbox>
                        <Checkbox
                          isSelected={formData.integraciones.metaAds}
                          onValueChange={(value) => setFormData({ 
                            ...formData, 
                            integraciones: { ...formData.integraciones, metaAds: value }
                          })}
                        >
                          Meta Ads
                        </Checkbox>
                        <Checkbox
                          isSelected={formData.integraciones.googleAds}
                          onValueChange={(value) => setFormData({ 
                            ...formData, 
                            integraciones: { ...formData.integraciones, googleAds: value }
                          })}
                        >
                          Google Ads
                        </Checkbox>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Módulos activos</p>
                        <div className="grid grid-cols-2 gap-2">
                          {availableModules.map(module => (
                            <Checkbox
                              key={module}
                              isSelected={formData.modulosActivos.includes(module)}
                              onValueChange={(value) => {
                                if (value) {
                                  setFormData({ 
                                    ...formData, 
                                    modulosActivos: [...formData.modulosActivos, module]
                                  });
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    modulosActivos: formData.modulosActivos.filter(m => m !== module)
                                  });
                                }
                              }}
                              isDisabled={module === 'Bewe OS'} // Always included
                            >
                              {module}
                            </Checkbox>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Card>
                        <CardBody className="space-y-4">
                          <h4 className="font-semibold text-foreground">Resumen del negocio</h4>
                          
                          {createNewContact && (
                            <div className="bg-primary/10 p-3 rounded-lg">
                              <p className="text-sm font-medium text-primary mb-1">Nuevo contacto</p>
                              <p className="text-sm text-primary/70">{newContactData.nombre}</p>
                              <p className="text-sm text-primary/70">{newContactData.email}</p>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-default-500">Negocio:</span>
                              <span className="font-medium">{formData.nombreNegocio}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-default-500">Etapa:</span>
                              <StageBadge stage={formData.etapa} />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-default-500">Plan:</span>
                              <Chip size="sm" variant="flat">{formData.plan}</Chip>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-default-500">MRR:</span>
                              <span className="font-medium">€{formData.mrr}/mes</span>
                            </div>
                            {formData.trial && (
                              <div className="flex justify-between">
                                <span className="text-default-500">Trial:</span>
                                <Chip size="sm" color="secondary" variant="flat">Activo</Chip>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                      
                      <div className="text-center text-default-500">
                        <p>¿Todo listo? Presiona crear para añadir el negocio.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </ModalBody>
            
            <ModalFooter>
              {currentStep === 1 ? (
                <>
                  <Button
                    variant="light"
                    onPress={handleClose}
                    radius="lg"
                  >
                    Cancelar
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleNext}
                    radius="lg"
                  >
                    Siguiente
                  </Button>
                </>
              ) : currentStep === 2 ? (
                <>
                  <Button
                    variant="light"
                    onPress={() => setCurrentStep(1)}
                    radius="lg"
                  >
                    Atrás
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleNext}
                    radius="lg"
                  >
                    Siguiente
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="light"
                    onPress={() => setCurrentStep(2)}
                    radius="lg"
                  >
                    Atrás
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleSubmit}
                    radius="lg"
                  >
                    Crear negocio
                  </Button>
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}; 