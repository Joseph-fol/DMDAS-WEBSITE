"use client";

import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isAuthOpen: boolean;
  authMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  isKeycodeOpen: boolean;
  openKeycodeModal: () => void;
  closeKeycodeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isKeycodeOpen, setIsKeycodeOpen] = useState(false);

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuthModal = () => setIsAuthOpen(false);

  const openKeycodeModal = () => setIsKeycodeOpen(true);
  const closeKeycodeModal = () => setIsKeycodeOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isAuthOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        isKeycodeOpen,
        openKeycodeModal,
        closeKeycodeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
