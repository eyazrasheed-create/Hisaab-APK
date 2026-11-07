import { AppSettings, Category, DayLedgerData, MonthlyStats, Transaction } from '../types';
import { DEFAULT_CATEGORIES } from './constants';
import { getTodayDateString } from './formatters';

const STORAGE_KEYS = {
  TRANSACTIONS: 'rh_transactions_v1',
  CATEGORIES: 'rh_categories_v1',
  SETTINGS: 'rh_settings_v1',
};

export const getDefaultSettings = (): AppSettings => ({
  currency: 'Rs',
  language: 'roman_urdu',
  initialBalance: 50000,
  initialBalanceDate: '2026-11-01',
  dailyExpenseBudget: 2500,
});

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return getDefaultSettings();
    return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse settings', e);
    return getDefaultSettings();
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
};

export const loadCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch (e) {
    console.error('Failed to parse categories', e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      const sample = generateSampleData();
      saveTransactions(sample);
      return sample;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse transactions', e);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
};

// Calculate Day-by-Day Ledger
export const calculateDayLedger = (
  date: string, // YYYY-MM-DD
  allTransactions: Transaction[],
  settings: AppSettings
): DayLedgerData => {
  const initialBalance = settings.initialBalance || 0;
  const initialDate = settings.initialBalanceDate || '2026-01-01';

  // Sort all transactions by date and time
  const sorted = [...allTransactions].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  // Calculate opening balance for the specified date:
  // Initial Balance + (Incomes before this date) - (Expenses before this date)
  let openingBalance = initialBalance;

  for (const tx of sorted) {
    if (tx.date < date && tx.date >= initialDate) {
      if (tx.type === 'income') {
        openingBalance += tx.amount;
      } else if (tx.type === 'expense') {
        openingBalance -= tx.amount;
      } else if (tx.type === 'opening_balance') {
        // If an explicit balance adjustment was made earlier
        openingBalance += tx.amount;
      }
    }
  }

  // Today's transactions
  const dayTransactions = sorted.filter((tx) => tx.date === date);

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of dayTransactions) {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
    } else if (tx.type === 'expense') {
      totalExpense += tx.amount;
    } else if (tx.type === 'opening_balance') {
      totalIncome += tx.amount;
    }
  }

  const closingBalance = openingBalance + totalIncome - totalExpense;

  return {
    date,
    openingBalance,
    totalIncome,
    totalExpense,
    closingBalance,
    transactions: dayTransactions,
  };
};

// Calculate Monthly Statistics
export const calculateMonthlyStats = (
  monthKey: string, // YYYY-MM
  allTransactions: Transaction[],
  categories: Category[]
): MonthlyStats => {
  const monthTransactions = allTransactions.filter((tx) => tx.date.startsWith(monthKey));

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryAmountMap: Record<string, { amount: number; count: number }> = {};
  const dailyMap: Record<number, { income: number; expense: number }> = {};

  const daysInMonth = new Date(
    Number(monthKey.split('-')[0]),
    Number(monthKey.split('-')[1]),
    0
  ).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    dailyMap[i] = { income: 0, expense: 0 };
  }

  const uniqueDaysSet = new Set<string>();

  for (const tx of monthTransactions) {
    const dayNum = parseInt(tx.date.split('-')[2], 10);
    uniqueDaysSet.add(tx.date);

    if (tx.type === 'income') {
      totalIncome += tx.amount;
      if (dailyMap[dayNum]) {
        dailyMap[dayNum].income += tx.amount;
      }
    } else if (tx.type === 'expense') {
      totalExpense += tx.amount;
      if (dailyMap[dayNum]) {
        dailyMap[dayNum].expense += tx.amount;
      }

      if (!categoryAmountMap[tx.categoryId]) {
        categoryAmountMap[tx.categoryId] = { amount: 0, count: 0 };
      }
      categoryAmountMap[tx.categoryId].amount += tx.amount;
      categoryAmountMap[tx.categoryId].count += 1;
    }
  }

  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  const categoryBreakdown = Object.entries(categoryAmountMap)
    .map(([catId, data]) => {
      const cat = categoryMap.get(catId) || {
        id: catId,
        name: catId,
        nameRoman: catId,
        nameUrdu: catId,
        color: '#64748b',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-700',
        icon: 'CircleDollarSign',
      };
      const percentage = totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0;
      const budgetLimit = cat.budgetLimit;
      const budgetUsedPercent = budgetLimit && budgetLimit > 0 ? (data.amount / budgetLimit) * 100 : undefined;

      return {
        category: cat,
        amount: data.amount,
        percentage,
        transactionCount: data.count,
        budgetLimit,
        budgetUsedPercent,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const dailyBreakdown = Object.entries(dailyMap).map(([dayStr, data]) => {
    const dayNum = Number(dayStr);
    const dateFormatted = `${monthKey}-${String(dayNum).padStart(2, '0')}`;
    return {
      date: dateFormatted,
      dayNum,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
    };
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const daysCount = uniqueDaysSet.size || 1;
  const dailyAverageSpend = totalExpense / daysCount;

  return {
    monthKey,
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    dailyAverageSpend,
    daysWithTransactions: uniqueDaysSet.size,
    categoryBreakdown,
    dailyBreakdown,
  };
};

// Generate realistic starter data
export const generateSampleData = (): Transaction[] => {
  const todayStr = getTodayDateString();
  const [year, month, currentDay] = todayStr.split('-').map(Number);

  const txs: Transaction[] = [];

  // Month-start salary/client payment
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`;
  txs.push({
    id: 'tx-init-income',
    date: monthStart,
    time: '10:00',
    type: 'income',
    amount: 85000,
    categoryId: 'income_general',
    paymentMethod: 'bank',
    note: 'Monthly Salary / Business Payment',
    createdAt: Date.now() - 6 * 86400000,
  });

  // House Grocery / Ration
  const groceryDate = `${year}-${String(month).padStart(2, '0')}-02`;
  txs.push({
    id: 'tx-sample-1',
    date: groceryDate,
    time: '18:30',
    type: 'expense',
    amount: 9400,
    categoryId: 'groceries',
    paymentMethod: 'cash',
    note: 'Atta, Chawal, Ghee aur Mahana Soda',
    createdAt: Date.now() - 5 * 86400000,
  });

  // Utility Bill
  const billDate = `${year}-${String(month).padStart(2, '0')}-03`;
  txs.push({
    id: 'tx-sample-2',
    date: billDate,
    time: '14:15',
    type: 'expense',
    amount: 4200,
    categoryId: 'bills',
    paymentMethod: 'easypaisa_jazzcash',
    note: 'Bijli & Wifi Ka Bill',
    createdAt: Date.now() - 4 * 86400000,
  });

  // Petrol
  const petrolDate = `${year}-${String(month).padStart(2, '0')}-04`;
  txs.push({
    id: 'tx-sample-3',
    date: petrolDate,
    time: '09:00',
    type: 'expense',
    amount: 1500,
    categoryId: 'transport',
    paymentMethod: 'cash',
    note: 'Bike Tanki Full Petrol',
    createdAt: Date.now() - 3 * 86400000,
  });

  // Yesterday's activities
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  txs.push(
    {
      id: 'tx-sample-4',
      date: yesterdayStr,
      time: '13:00',
      type: 'expense',
      amount: 650,
      categoryId: 'food',
      paymentMethod: 'cash',
      note: 'Dost ke sath dhabba chai & biryani',
      createdAt: Date.now() - 86400000 + 3600000,
    },
    {
      id: 'tx-sample-5',
      date: yesterdayStr,
      time: '20:15',
      type: 'expense',
      amount: 450,
      categoryId: 'health',
      paymentMethod: 'cash',
      note: 'Panadol aur Flu ki dawai',
      createdAt: Date.now() - 86400000 + 25000000,
    }
  );

  // Today's activities
  txs.push(
    {
      id: 'tx-sample-today-1',
      date: todayStr,
      time: '08:30',
      type: 'expense',
      amount: 250,
      categoryId: 'food',
      paymentMethod: 'cash',
      note: 'Subah Ka Nashta & Anda Paratha',
      createdAt: Date.now() - 14400000,
    },
    {
      id: 'tx-sample-today-2',
      date: todayStr,
      time: '11:15',
      type: 'expense',
      amount: 800,
      categoryId: 'transport',
      paymentMethod: 'cash',
      note: 'Bike Petrol & Hawa check',
      createdAt: Date.now() - 7200000,
    },
    {
      id: 'tx-sample-today-3',
      date: todayStr,
      time: '14:40',
      type: 'expense',
      amount: 400,
      categoryId: 'mobile',
      paymentMethod: 'easypaisa_jazzcash',
      note: 'Weekly Data Package Super Card',
      createdAt: Date.now() - 3600000,
    }
  );

  return txs;
};
