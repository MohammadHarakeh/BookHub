"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";

type ContextValue = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  userLoggedIn: boolean;
  setUserLoggedIn: Dispatch<SetStateAction<boolean>>;
  userInfo: any;
  setUserInfo: Dispatch<SetStateAction<any>>;
  repoInfo: any;
  setRepoInfo: Dispatch<SetStateAction<any>>;
};

const EmailContext = createContext<ContextValue | undefined>(undefined);

export default function Provider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [repoInfo, setRepoInfo] = useState<any>();

  return (
    <EmailContext.Provider
      value={{
        email,
        setEmail,
        userLoggedIn,
        setUserLoggedIn,
        userInfo,
        setUserInfo,
        repoInfo,
        setRepoInfo,
      }}
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
