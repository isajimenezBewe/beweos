import * as React from "react";
import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";
import { ContactsProvider } from "./contexts/ContactsContext";
import { DealsProvider } from "./contexts/DealsContext";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ContactsProvider>
        <DealsProvider>
          {children}
        </DealsProvider>
      </ContactsProvider>
    </HeroUIProvider>
  );
}
