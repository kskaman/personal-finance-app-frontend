import { ReactNode } from "react";

// Option Data type for Settings font and currency options
export interface SettingsRadioOption {
    value: string;
    symbol: string | ReactNode;
    label: string;
  }