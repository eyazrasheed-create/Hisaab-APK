import { Category, PaymentMethod } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    nameRoman: 'Khana Peena & Hoteling',
    nameUrdu: 'کھانا پینا اور ہوٹل',
    color: '#f97316', // orange
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    icon: 'Utensils',
    budgetLimit: 15000,
  },
  {
    id: 'groceries',
    name: 'Groceries & Ration',
    nameRoman: 'Ghar Ka Sauda & Ration',
    nameUrdu: 'گھر کا سودا اور راشن',
    color: '#10b981', // emerald
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: 'ShoppingBasket',
    budgetLimit: 25000,
  },
  {
    id: 'transport',
    name: 'Fuel & Transport',
    nameRoman: 'Petrol & Safar',
    nameUrdu: 'پٹرول اور سفر',
    color: '#0284c7', // sky
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    icon: 'Fuel',
    budgetLimit: 8000,
  },
  {
    id: 'bills',
    name: 'Bills & Utilities',
    nameRoman: 'Bijli, Gas & Net Bills',
    nameUrdu: 'بجلی، گیس اور انٹرنیٹ بلز',
    color: '#eab308', // amber
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: 'Zap',
    budgetLimit: 12000,
  },
  {
    id: 'shopping',
    name: 'Shopping & Clothes',
    nameRoman: 'Kharidari & Kapray',
    nameUrdu: 'خریداری اور کپڑے',
    color: '#ec4899', // pink
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    icon: 'ShoppingBag',
    budgetLimit: 10000,
  },
  {
    id: 'health',
    name: 'Health & Medicine',
    nameRoman: 'Sehat & Dawaai',
    nameUrdu: 'صحت اور دوائی',
    color: '#ef4444', // red
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    icon: 'HeartPulse',
    budgetLimit: 5000,
  },
  {
    id: 'mobile',
    name: 'Mobile & Internet',
    nameRoman: 'Mobile Load & Packages',
    nameUrdu: 'موبائل لوڈ اور پیکجز',
    color: '#8b5cf6', // purple
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: 'Smartphone',
    budgetLimit: 3000,
  },
  {
    id: 'rent',
    name: 'Home & Rent',
    nameRoman: 'Makan Ka Kiraya',
    nameUrdu: 'مکان کا کرایہ اور مرمت',
    color: '#6366f1', // indigo
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    icon: 'Home',
    budgetLimit: 30000,
  },
  {
    id: 'education',
    name: 'Education & Fees',
    nameRoman: 'Taleem & Bachon Ki Fees',
    nameUrdu: 'تعلیم اور فیس',
    color: '#06b6d4', // cyan
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    icon: 'GraduationCap',
    budgetLimit: 15000,
  },
  {
    id: 'personal',
    name: 'Personal & Entertainment',
    nameRoman: 'Zati Kharcha & Tafreeh',
    nameUrdu: 'ذاتی خرچہ اور تفریح',
    color: '#14b8a6', // teal
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    icon: 'Coffee',
    budgetLimit: 5000,
  },
  {
    id: 'debt',
    name: 'Debt & Loans',
    nameRoman: 'Udhaar / Qarz Wapsi',
    nameUrdu: 'ادھار اور قرض',
    color: '#64748b', // slate
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-700',
    icon: 'HandCoins',
  },
  {
    id: 'income_general',
    name: 'Salary & Earnings',
    nameRoman: 'Tankhwah / Kamai',
    nameUrdu: 'تنخواہ اور کمائی',
    color: '#22c55e', // green
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    icon: 'Wallet',
  },
  {
    id: 'other',
    name: 'Other Expenses',
    nameRoman: 'Deegar Mutafariq Kharch',
    nameUrdu: 'دیگر متفرق اخراجات',
    color: '#71717a', // zinc
    bgColor: 'bg-zinc-50',
    textColor: 'text-zinc-700',
    icon: 'CircleDollarSign',
  },
];

export const PAYMENT_METHODS: { id: PaymentMethod; labelEn: string; labelRoman: string; labelUrdu: string }[] = [
  { id: 'cash', labelEn: 'Cash in Hand', labelRoman: 'Naqad / Cash', labelUrdu: 'نقد' },
  { id: 'bank', labelEn: 'Bank Account', labelRoman: 'Bank Transfer', labelUrdu: 'بینک اکاؤنٹ' },
  { id: 'easypaisa_jazzcash', labelEn: 'EasyPaisa / JazzCash / Raast', labelRoman: 'EasyPaisa / JazzCash / Raast', labelUrdu: 'ایزی پیسہ / جاز کیش' },
  { id: 'card', labelEn: 'Debit / Credit Card', labelRoman: 'Card Payment', labelUrdu: 'کارڈ' },
  { id: 'other', labelEn: 'Other Mode', labelRoman: 'Deegar Zariya', labelUrdu: 'دیگر' },
];

export const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
