import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Contact {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  etiquetas: string[];
  ultimaActividad: Date;
  impago: boolean;
  avatar?: string;
}

interface ContactsContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'ultimaActividad'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContactById: (id: string) => Contact | undefined;
  checkDuplicateEmail: (email: string) => boolean;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

// Mockup data
const initialContacts: Contact[] = [
  {
    id: '1',
    nombre: 'María García',
    email: 'maria.garcia@empresa.com',
    telefono: '+34 612 345 678',
    empresa: 'Tech Solutions SL',
    estado: 'activo',
    etiquetas: ['VIP', 'Madrid'],
    ultimaActividad: new Date('2024-01-15'),
    impago: false,
  },
  {
    id: '2',
    nombre: 'Carlos Rodríguez',
    email: 'carlos@startup.io',
    telefono: '+34 623 456 789',
    empresa: 'StartupIO',
    estado: 'activo',
    etiquetas: ['Startup', 'Barcelona'],
    ultimaActividad: new Date('2024-01-14'),
    impago: true,
  },
  {
    id: '3',
    nombre: 'Ana Martínez',
    email: 'ana.martinez@corp.es',
    telefono: '+34 634 567 890',
    empresa: 'Corporate España',
    estado: 'inactivo',
    etiquetas: ['Enterprise'],
    ultimaActividad: new Date('2024-01-10'),
    impago: false,
  },
  {
    id: '4',
    nombre: 'Roberto Silva',
    email: 'roberto@agency.com',
    telefono: '+34 645 678 901',
    empresa: 'Digital Agency',
    estado: 'pendiente',
    etiquetas: ['Agencia', 'Valencia'],
    ultimaActividad: new Date('2024-01-12'),
    impago: false,
  },
];

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);

  const addContact = (contactData: Omit<Contact, 'id' | 'ultimaActividad'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      ultimaActividad: new Date(),
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: string, contactData: Partial<Contact>) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, ...contactData } : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const checkDuplicateEmail = (email: string) => {
    return contacts.some(contact => contact.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <ContactsContext.Provider value={{
      contacts,
      addContact,
      updateContact,
      deleteContact,
      getContactById,
      checkDuplicateEmail,
    }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}; 