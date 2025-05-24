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
import { motion, AnimatePresence } from 'framer-motion';
import { useContacts } from '@/contexts/ContactsContext';
import { useToast } from '@/components/shared/Toast';

interface NewContactWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewContactWizard: React.FC<NewContactWizardProps> = ({ isOpen, onClose }) => {
  const { addContact, checkDuplicateEmail } = useContacts();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    estado: 'activo' as const,
    etiquetas: [] as string[],
    impago: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
    
    if (formData.email && checkDuplicateEmail(formData.email)) {
      newErrors.email = 'Ya existe un contacto con este email';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = () => {
    addContact(formData);
    showToast('Contacto creado exitosamente', 'success');
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      estado: 'activo',
      etiquetas: [],
      impago: false,
    });
    setErrors({});
    setCurrentStep(1);
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
      size="2xl"
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
                <h3 className="text-xl font-semibold">Nuevo contacto</h3>
                <Chip size="sm" radius="full" variant="flat">
                  Paso {currentStep} de 2
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
                      <Input
                        label="Nombre completo"
                        placeholder="Ej: María García"
                        value={formData.nombre}
                        onValueChange={(value) => setFormData({ ...formData, nombre: value })}
                        isInvalid={!!errors.nombre}
                        errorMessage={errors.nombre}
                        isRequired
                        radius="lg"
                      />
                      
                      <Input
                        label="Email"
                        placeholder="maria@empresa.com"
                        type="email"
                        value={formData.email}
                        onValueChange={(value) => setFormData({ ...formData, email: value })}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email}
                        isRequired
                        radius="lg"
                      />
                      
                      <Input
                        label="Teléfono"
                        placeholder="+34 600 000 000"
                        value={formData.telefono}
                        onValueChange={(value) => setFormData({ ...formData, telefono: value })}
                        isInvalid={!!errors.telefono}
                        errorMessage={errors.telefono}
                        isRequired
                        radius="lg"
                      />
                      
                      <Input
                        label="Empresa"
                        placeholder="Nombre de la empresa"
                        value={formData.empresa}
                        onValueChange={(value) => setFormData({ ...formData, empresa: value })}
                        radius="lg"
                      />
                      
                      <Select
                        label="Estado"
                        selectedKeys={[formData.estado]}
                        onSelectionChange={(keys) => setFormData({ ...formData, estado: Array.from(keys)[0] as any })}
                        radius="lg"
                      >
                        <SelectItem key="activo">Activo</SelectItem>
                        <SelectItem key="inactivo">Inactivo</SelectItem>
                        <SelectItem key="pendiente">Pendiente</SelectItem>
                      </Select>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-content2 rounded-2xl p-6">
                        <h4 className="font-semibold text-foreground mb-4">Resumen del contacto</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-default-500">Nombre:</span>
                            <span className="font-medium">{formData.nombre}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-default-500">Email:</span>
                            <span className="font-medium">{formData.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-default-500">Teléfono:</span>
                            <span className="font-medium">{formData.telefono}</span>
                          </div>
                          {formData.empresa && (
                            <div className="flex justify-between">
                              <span className="text-default-500">Empresa:</span>
                              <span className="font-medium">{formData.empresa}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-default-500">Estado:</span>
                            <Chip size="sm" color={formData.estado === 'activo' ? 'success' : 'default'} variant="flat">
                              {formData.estado}
                            </Chip>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center text-default-500">
                        <p>¿Todo listo? Presiona crear para añadir el contacto.</p>
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
              ) : (
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
                    onPress={handleSubmit}
                    radius="lg"
                  >
                    Crear contacto
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