import { useState, ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";
import { Currencies, Fonts } from "../types/settingsData";

interface SettingsProviderProps {
  children: ReactNode;
  font: Fonts;
  currency: Currencies;
}

export const SettingsProvider = ({
  children,
  font,
  currency,
}: SettingsProviderProps) => {
  // Initial font is "public-sans" and initial currency is "usd" (from your data.json)
  const [selectedFont, setSelectedFont] = useState<Fonts>(font);
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currencies>(currency);

  return (
    <SettingsContext.Provider
      value={{
        selectedFont,
        setSelectedFont,
        selectedCurrency,
        setSelectedCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
