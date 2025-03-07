import React from "react";
import { Currencies, Fonts } from "../types/settingsData";

export interface SettingsContextType {
  selectedFont: Fonts;
  setSelectedFont: React.Dispatch<React.SetStateAction<Fonts>>;
  selectedCurrency: Currencies;
  setSelectedCurrency: React.Dispatch<React.SetStateAction<Currencies>>;
}

export const SettingsContext = React.createContext<SettingsContextType>({
  selectedFont: "public-sans",
  setSelectedFont: () => {},
  selectedCurrency: "$",
  setSelectedCurrency: () => {},
});
