import React from "react";

export interface SettingsContextType {
  selectedFont: "public-sans" | "noto-serif" | "inter";
  setSelectedFont: React.Dispatch<
    React.SetStateAction<"public-sans" | "noto-serif" | "inter">
  >;
}

export const SettingsContext = React.createContext<SettingsContextType>({
  selectedFont: "public-sans",
  setSelectedFont: () => {},
});
