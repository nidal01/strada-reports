"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type DemoRequestContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const DemoRequestContext = createContext<DemoRequestContextValue | null>(null);

export function DemoRequestProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <DemoRequestContext.Provider value={value}>
      {children}
    </DemoRequestContext.Provider>
  );
}

export function useDemoRequest() {
  const context = useContext(DemoRequestContext);
  if (!context) {
    throw new Error("useDemoRequest must be used within DemoRequestProvider");
  }
  return context;
}
