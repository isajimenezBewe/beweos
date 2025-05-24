import * as React from "react";

import {HeroUIProvider} from "@heroui/react";

import { ContactsProvider } from "./contexts/ContactsContext";
import { DealsProvider } from "./contexts/DealsContext";


export function Provider({ children }: { children: React.ReactNode }) {


  return (
    <HeroUIProvider>
      <ContactsProvider>
        <DealsProvider>
          {children}
        </DealsProvider>
      </ContactsProvider>
    </HeroUIProvider>
  );
}
