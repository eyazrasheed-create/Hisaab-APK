import { Language } from '../types';

export const t = (key: string, lang: Language = 'roman_urdu'): string => {
  const dictionary: Record<string, Record<Language, string>> = {
    // App Header & Branding
    appTitle: {
      roman_urdu: 'Rozana Hisaab',
      english: 'Daily Expense Ledger',
      urdu: 'روزانہ حساب',
    },
    appSubtitle: {
      roman_urdu: 'Daily Cash & Kharcha Tracker',
      english: 'Personal Daily Cash & Expense Tracker',
      urdu: 'ذاتی اخراجات اور کیش بک',
    },
    // Tabs / Nav
    tabDaily: {
      roman_urdu: 'Rozana Hisaab',
      english: 'Daily Ledger',
      urdu: 'روزانہ حساب',
    },
    tabMonthly: {
      roman_urdu: 'Mahana Khulasa',
      english: 'Monthly Summary',
      urdu: 'ماہانہ خلاصہ',
    },
    tabTransactions: {
      roman_urdu: 'Tamam Entries',
      english: 'All Transactions',
      urdu: 'تمام اندراجات',
    },
    tabBudgets: {
      roman_urdu: 'Categories & Budget',
      english: 'Categories & Budgets',
      urdu: 'کیٹگریز اور بجٹ',
    },

    // Daily Core Metrics (Directly matching user prompt!)
    openingBalanceLabel: {
      roman_urdu: 'Total Kitne Paisay Thay',
      english: 'Starting Balance',
      urdu: 'شروعاتی رقم (کتنے پیسے تھے)',
    },
    openingBalanceSub: {
      roman_urdu: 'Din ke aaghaz ki raqam',
      english: 'Day opening balance',
      urdu: 'دن کے آغاز پر موجود رقم',
    },
    todayExpensesLabel: {
      roman_urdu: 'Aaj Kider Use Kiye',
      english: "Today's Expenses",
      urdu: 'آج کدھر خرچ کیے',
    },
    todayExpensesSub: {
      roman_urdu: 'Kul kharch shuda raqam',
      english: 'Total spent today',
      urdu: 'آج کا کل خرچہ',
    },
    remainingBalanceLabel: {
      roman_urdu: 'Baqi Kitne Hain',
      english: 'Remaining Balance',
      urdu: 'باقی کتنے ہیں',
    },
    remainingBalanceSub: {
      roman_urdu: 'Abhi dastiyaab raqam',
      english: 'Available balance now',
      urdu: 'اس وقت موجود باقی رقم',
    },
    todayIncomeLabel: {
      roman_urdu: 'Aaj Aamad Hui',
      english: "Today's Income",
      urdu: 'آج آمدنی ہوئی',
    },
    todayIncomeSub: {
      roman_urdu: 'Naye paisay jo aaye',
      english: 'Money received today',
      urdu: 'آج جو پیسے آئے',
    },

    // Actions
    addExpense: {
      roman_urdu: 'Naya Kharcha Likhein',
      english: 'Add Expense',
      urdu: 'نیا خرچہ لکھیں',
    },
    addIncome: {
      roman_urdu: 'Aamad / Paisay Aaye',
      english: 'Add Income',
      urdu: 'آمدنی درج کریں',
    },
    setInitialBalance: {
      roman_urdu: 'Shuruati Raqam Badlein',
      english: 'Adjust Balance',
      urdu: 'بنیادی رقم تبدیل کریں',
    },
    exportData: {
      roman_urdu: 'Data Backup / CSV',
      english: 'Backup & Export',
      urdu: 'بیک اپ اور ڈاؤنلوڈ',
    },

    // Date navigation
    today: {
      roman_urdu: 'Aaj',
      english: 'Today',
      urdu: 'آج',
    },
    yesterday: {
      roman_urdu: 'Kal (Guzra)',
      english: 'Yesterday',
      urdu: 'کل (گزرا ہوا)',
    },
    tomorrow: {
      roman_urdu: 'Kal (Aane Wala)',
      english: 'Tomorrow',
      urdu: 'کل',
    },
    previousDay: {
      roman_urdu: 'Pichla Din',
      english: 'Previous Day',
      urdu: 'پچھلا دن',
    },
    nextDay: {
      roman_urdu: 'Agla Din',
      english: 'Next Day',
      urdu: 'اگلا دن',
    },

    // Empty states
    noTransactionsToday: {
      roman_urdu: 'Aaj abhi tak koi kharcha ya aamad darj nahi hui.',
      english: 'No expenses or income logged for this date yet.',
      urdu: 'اس تاریخ کے لیے ابھی تک کوئی خرچہ یا آمدنی درج نہیں کی گئی',
    },
    addFirstTodayPrompt: {
      roman_urdu: 'Pehla kharcha ya aamad darj karne ke liye upar button dabayein.',
      english: 'Click above to record your first spend or inflow.',
      urdu: 'پہلا اندراج کرنے کے لیے اوپر دیے گئے بٹن پر کلک کریں',
    },

    // Monthly summary labels
    monthTotalIncome: {
      roman_urdu: 'Kul Mahana Aamad',
      english: 'Total Monthly Income',
      urdu: 'کل ماہانہ آمدنی',
    },
    monthTotalExpense: {
      roman_urdu: 'Kul Mahana Kharcha',
      english: 'Total Monthly Expense',
      urdu: 'کل ماہانہ خرچہ',
    },
    monthNetSavings: {
      roman_urdu: 'Kul Bachat (Net Savings)',
      english: 'Net Savings',
      urdu: 'خالص بچت',
    },
    dailyAverage: {
      roman_urdu: 'Rozana Ausat Kharcha',
      english: 'Daily Average Spend',
      urdu: 'روزانہ اوسط خرچہ',
    },
    categoryBreakdownTitle: {
      roman_urdu: 'Kharcha Kaha Hua (Category Breakdown)',
      english: 'Spending by Category',
      urdu: 'کیٹگری کے لحاظ سے اخراجات',
    },
    dailyTrendsTitle: {
      roman_urdu: 'Rozana Kharcha Graph',
      english: 'Daily Spending Trend',
      urdu: 'روزانہ خرچ کا رجحان',
    },
    dayWiseLedgerTitle: {
      roman_urdu: 'Rozana Hisaab Table (Day-by-Day Sheet)',
      english: 'Day-by-Day Cash Sheet',
      urdu: 'روزانہ کیش شیٹ',
    },

    // Form modal labels
    amount: {
      roman_urdu: 'Raqam (Amount)',
      english: 'Amount',
      urdu: 'رقم',
    },
    category: {
      roman_urdu: 'Category (Madad)',
      english: 'Category',
      urdu: 'کیٹگری',
    },
    paymentMethod: {
      roman_urdu: 'Zariya (Payment Method)',
      english: 'Payment Method',
      urdu: 'طریقہ ادائیگی',
    },
    note: {
      roman_urdu: 'Tafseel / Wajah (Note)',
      english: 'Description / Note',
      urdu: 'تفصیل / وجہ',
    },
    date: {
      roman_urdu: 'Tareekh (Date)',
      english: 'Date',
      urdu: 'تاریخ',
    },
    time: {
      roman_urdu: 'Waqt (Time)',
      english: 'Time',
      urdu: 'وقت',
    },
    save: {
      roman_urdu: 'Save Karein',
      english: 'Save Entry',
      urdu: 'محفوظ کریں',
    },
    cancel: {
      roman_urdu: 'Cancel',
      english: 'Cancel',
      urdu: 'منسوخ کریں',
    },
    delete: {
      roman_urdu: 'Khatam Karein (Delete)',
      english: 'Delete',
      urdu: 'حذف کریں',
    },
    searchPlaceholder: {
      roman_urdu: 'Tafseel ya note se dhoondein...',
      english: 'Search by note, description or category...',
      urdu: 'تفصیل یا کیٹگری سے تلاش کریں...',
    },
  };

  return dictionary[key]?.[lang] || dictionary[key]?.['roman_urdu'] || key;
};
