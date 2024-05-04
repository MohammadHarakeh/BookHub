"use client";
import { createContext, useContext, useState } from "react";
import { Dispatch, SetStateAction } from "react";

interface ContextValue {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const EmailContext = createContext<ContextValue | undefined>(undefined);

export default function Provider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  return (
    <EmailContext.Provider
      value={{ email, setEmail, userLoggedIn, setUserLoggedIn }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmailContext() {
  const context = useContext(EmailContext);

  if (context === undefined) {
    throw new Error("use context is not found");
  }
  return context;
}
