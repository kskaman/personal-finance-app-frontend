import { Currencies, DisplayedModules, Fonts } from "./settingsData";

export interface Balance {
    current: number;
    income: number;
    expenses: number;
}

export interface Transaction {
    id: string;
    avatar?: string;
    name: string;
    category: string;
    date: string;
    theme: string;
    amount: number;
    recurring: boolean;
    recurringId?: string;
}

export interface RecurringBill {
    id: string;
    avatar?: string;
    name: string;
    category: string;
    amount: number;
    recurring: boolean;
    lastPaid: string;
    dueDate: string;
    theme: string;
}


export interface RecurringSummary {
    paid: { count: number; total: number };
    unpaid: { count: number; total: number };
    dueSoon: { count: number; total: number };
    due: { count: number; total: number };
}

export interface Budget {
    category: string;
    maximum: number;
    theme: string;
}

export interface MarkerTheme {
    name: string;
    colorCode: string;
    usedInBudgets: boolean;
    usedInPots: boolean;
}

export interface Category {

    name: string;
    id: string;
    usedInBudgets: boolean;
    type: "standard" | "custom";
  }

export interface Pot {
    name: string;
    target: number;
    total: number;
    theme: string;
}

export interface Settings {
    font: Fonts;
    currency: Currencies;
    displayedModules: DisplayedModules;
  }
  
export interface DataType {
    userId: string;
    dataId: string;
    settings: Settings;
    balance: Balance;
    transactions: Transaction[];
    budgets: Budget[];
    pots: Pot[];
    recurringBills: RecurringBill[]; 
    categories: Category[];
    markerThemes: MarkerTheme[];
}
  
  