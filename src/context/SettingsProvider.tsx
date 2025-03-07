import { useState, ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // Initial font is set to "publicSans"
  const [selectedFont, setSelectedFont] = useState<
    "public-sans" | "noto-serif" | "inter"
  >("public-sans");

  return (
    <SettingsContext.Provider value={{ selectedFont, setSelectedFont }}>
      {children}
    </SettingsContext.Provider>
  );
};
