export type TransactionType = 'expense' | 'income' | 'opening_balance';

export type PaymentMethod = 'cash' | 'bank' | 'easypaisa_jazzcash' | 'card' | 'other';

export type Language = 'roman_urdu' | 'english' | 'urdu';

export type CurrencySymbol = 'Rs' | 'PKR' | '$' | '₹' | 'AED' | 'SAR' | '€' | '£';

export interface Category {
  id: string;
  name: string;
  nameRoman: string;
  nameUrdu: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  isCustom?: boolean;
  budgetLimit?: number; // Monthly budget limit
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: TransactionType;
  amount: number;
  categoryId: string;
  paymentMethod: PaymentMethod;
  note: string;
  createdAt: number;
}

export interface DayLedgerData {
  date: string; // YYYY-MM-DD
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  closingBalance: number;
  transactions: Transaction[];
}

export interface MonthlyStats {
  monthKey: string; // YYYY-MM
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  dailyAverageSpend: number;
  daysWithTransactions: number;
  categoryBreakdown: {
    category: Category;
    amount: number;
    percentage: number;
    transactionCount: number;
    budgetLimit?: number;
    budgetUsedPercent?: number;
  }[];
  dailyBreakdown: {
    date: string;
    dayNum: number;
    income: number;
    expense: number;
    net: number;
  }[];
}

export interface AppSettings {
  currency: CurrencySymbol;
  language: Language;
  initialBalance: number; // Starting balance baseline
  initialBalanceDate: string; // YYYY-MM-DD from when initialBalance started
  dailyExpenseBudget?: number;
}

// Khata (Len-Den / Person-to-Person Ledger)
export type KhataType = 'gave' | 'received'; 
// 'gave': Maine Diye / Kharcha Kiya (He owes you / You gave him cash or spent for him)
// 'received': Usne Diye / Wapis Kiye (He paid you / returned money / cleared balance)

export interface KhataPerson {
  id: string;
  name: string; // e.g. "Bhai (Brother)", "Ali (Worker)", "Ahmed"
  phone?: string;
  role?: string; // "Bhai / Family", "Worker / Mulazim", "Partner", "Dost / Friend", "Customer", "Other"
  notes?: string;
  createdAt: number;
}

export interface KhataTransaction {
  id: string;
  personId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  amount: number;
  type: KhataType;
  note: string;
  syncWithCash?: boolean; // Whether it was also synced to daily cash
  paymentMethod?: PaymentMethod;
  createdAt: number;
}

export interface PersonBalance {
  person: KhataPerson;
  totalGave: number; // Maine Diye (You Gave)
  totalReceived: number; // Usne Diye (He Gave)
  netBalance: number; // totalGave - totalReceived. Positive = Lene Hain, Negative = Dene Hain, 0 = Clear
  status: 'receivable' | 'payable' | 'settled';
  transactionCount: number;
  lastTransactionDate?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  loginType: 'phone' | 'email';
  identifier: string; // phone number or email
  pin?: string;
  businessName?: string;
  createdAt: number;
  lastLoginAt: number;
}

