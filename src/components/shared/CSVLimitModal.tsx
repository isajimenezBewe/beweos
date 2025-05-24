import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';

interface CSVLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowCount: number;
  maxRows?: number;
}

export const M_CSVLimit: React.FC<CSVLimitModalProps> = ({
  isOpen,
  onClose,
  rowCount,
  maxRows = 1000
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      radius="lg"
      classNames={{
        base: "bg-white",
        header: "border-b border-gray-200",
        body: "py-6",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">Límite de exportación excedido</h3>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-600">
                Tu selección contiene <span className="font-semibold">{rowCount.toLocaleString()}</span> filas, 
                pero el límite de exportación es de <span className="font-semibold">{maxRows.toLocaleString()}</span> filas.
              </p>
              <p className="text-gray-600 mt-2">
                Por favor, aplica filtros para reducir la cantidad de registros a exportar.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={onClose}
                radius="lg"
              >
                Aplicar filtros
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                radius="lg"
              >
                Entendido
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}; 