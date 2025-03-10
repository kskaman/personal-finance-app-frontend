import { ReactNode } from "react";

// Option Data type for Settings font and currency options
export interface SettingsRadioOption {
    value: string;
    symbol: ReactNode;
    label: ReactNode;
}
  

export interface DisplayedModules {
    pots: DisplayedModule;
    recurringBills: DisplayedModule;
    budgets: DisplayedModule;
}
  
export type Fonts = "public-sans" | "noto-serif" | "source-code";

export type Currencies = "$" | "C$" | "€";

export interface DisplayedModule {
    label: string;
    using: boolean;
  }