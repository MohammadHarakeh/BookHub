"use client";
import { createContext, useContext, useState } from "react";
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
  collabInfo: any;
  setCollabInfo: Dispatch<SetStateAction<any>>;
  allCollaboratingRepos: any;
  setAllCollaboratingRepos: Dispatch<SetStateAction<any>>;
  storyVersions: any;
  setStoryVersions: Dispatch<SetStateAction<any>>;
  storyDifference: any;
  setStoryDifference: Dispatch<SetStateAction<any>>;
  themeMode: "light" | "dark";
  toggleTheme: () => void;
};

const EmailContext = createContext<ContextValue | undefined>(undefined);

export default function Provider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string>("");
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [repoInfo, setRepoInfo] = useState<any>();
  const [collabInfo, setCollabInfo] = useState<any>();
  const [allCollaboratingRepos, setAllCollaboratingRepos] = useState<any>();
  const [storyVersions, setStoryVersions] = useState<any>();
  const [storyDifference, setStoryDifference] = useState<any>();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

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
        collabInfo,
        setCollabInfo,
        setAllCollaboratingRepos,
        allCollaboratingRepos,
        storyVersions,
        setStoryVersions,
        storyDifference,
        setStoryDifference,
        themeMode,
        toggleTheme,
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
