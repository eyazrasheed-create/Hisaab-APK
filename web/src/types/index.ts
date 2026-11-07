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
