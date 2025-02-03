export interface Balance {
    current: number;
    income: number;
    expenses: number;
}

export interface Transaction {
    avatar?: string;
    name: string;
    category: string;
    date: string;
    amount: number;
    recurring: boolean;
}

export interface RecurringBill extends Transaction {
    avatar?: string;
    name: string;
    category: string;
    amount: number;
    recurring: boolean;
    lastPaid: string;
    dueDate: string;
}


export interface RecurringSummary {
    paid: { count: number; total: number };
    unpaid: { count: number; total: number };
    dueSoon: { count: number; total: number };
}

export interface Budget {
    category: string;
    maximum: number;
    theme: string;
}

export interface Pot {
    name: string;
    target: number;
    total: number;
    theme: string;
}
  
export interface DataType {
    balance: Balance;
    transactions: Transaction[];
    budgets: Budget[];
    pots: Pot[];
    recurringBills: RecurringBill[]; 
}
  
  