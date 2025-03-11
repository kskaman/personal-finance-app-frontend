import { useState, ReactNode } from "react";
import { SettingsContext } from "./SettingsContext";
import { Currencies, Fonts, DisplayedModules } from "../types/settingsData";
import { ThemeManager } from "./ThemeManager";

interface SettingsProviderProps {
  children: ReactNode;
  font: Fonts;
  currency: Currencies;
  displayedModules: DisplayedModules;
}

export const SettingsProvider = ({
  children,
  font,
  currency,
  displayedModules,
}: SettingsProviderProps) => {
  const [selectedFont, setSelectedFont] = useState<Fonts>(font);
  const [selectedCurrency, setSelectedCurrency] =
    useState<Currencies>(currency);
  const [modules, setDisplayedModules] =
    useState<DisplayedModules>(displayedModules);

  return (
    <SettingsContext.Provider
      value={{
        selectedFont,
        setSelectedFont,
        selectedCurrency,
        setSelectedCurrency,
        displayedModules: modules,
        setDisplayedModules,
      }}
    >
      <ThemeManager>{children}</ThemeManager>
    </SettingsContext.Provider>
  );
};
