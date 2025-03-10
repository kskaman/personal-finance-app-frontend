import { createContext } from "react";
import { Fonts, Currencies, DisplayedModules } from "../types/settingsData";

export interface SettingsContextType {
  selectedFont: Fonts;
  setSelectedFont: React.Dispatch<React.SetStateAction<Fonts>>;
  selectedCurrency: Currencies;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currencies>>;
  displayedModules: DisplayedModules;
  setDisplayedModules: React.Dispatch<React.SetStateAction<DisplayedModules>>;
}

export const SettingsContext = createContext<SettingsContextType>({
  selectedFont: "public-sans",
  setSelectedFont: () => {},
  selectedCurrency: "$",
  setSelectedCurrency: () => {},
  displayedModules: {
    pots: { label: "Pots", using: true },
    recurringBills: { label: "Recurring Bills", using: true },
    budgets: { label: "Budgets", using: true },
  },
  setDisplayedModules: () => {},
});
