import React from 'react';
import { AppSettings, Category, DayLedgerData, Language, Transaction } from '../types';
import { formatCurrency, formatDateDisplay, getTodayDateString } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryIcon } from './CategoryIcon';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Coins,
  Edit2,
  Trash2,
  CreditCard,
  Building2,
  Calendar,
  Sparkles,
  Smartphone,
  Download,
} from 'lucide-react';

interface DailyLedgerViewProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
  dayLedger: DayLedgerData;
  categories: Category[];
  settings: AppSettings;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenSetBalance: () => void;
  onOpenInstallModal?: () => void;
}

export const DailyLedgerView: React.FC<DailyLedgerViewProps> = ({
  currentDate,
  setCurrentDate,
  dayLedger,
  categories,
  settings,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  onOpenSetBalance,
  onOpenInstallModal,
}) => {
  const { language, currency, dailyExpenseBudget = 2500 } = settings;
  const categoryMap = new Map<string, Category>(categories.map((c) => [c.id, c]));

  // Date shifting
  const handleShiftDay = (daysDelta: number) => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + daysDelta);
    const newY = date.getFullYear();
    const newM = String(date.getMonth() + 1).padStart(2, '0');
    const newD = String(date.getDate()).padStart(2, '0');
    setCurrentDate(`${newY}-${newM}-${newD}`);
  };

  const isToday = currentDate === getTodayDateString();

  // Payment method breakdown for today
  const paymentBreakdown = dayLedger.transactions.reduce((acc, tx) => {
    if (tx.type === 'expense') {
      acc[tx.paymentMethod] = (acc[tx.paymentMethod] || 0) + tx.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const budgetUsedPercent = dailyExpenseBudget > 0 ? (dayLedger.totalExpense / dailyExpenseBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Date Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleShiftDay(-1)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Pichla Din"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{formatDateDisplay(currentDate, language)}</span>
              {isToday && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Ledger ID: {currentDate}
            </div>
          </div>

          <button
            onClick={() => handleShiftDay(1)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Agla Din"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Date Controls */}
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => setCurrentDate(getTodayDateString())}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Aaj Par Jayein (Today)
            </button>
          )}

          <div className="relative">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => e.target.value && setCurrentDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden hover:bg-slate-100 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mobile App Install & APK Card Banner */}
      {onOpenInstallModal && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>Apne Mobile Par Install Karein / Download APK</span>
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded">Offline Ready</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Baghair browser ke direct phone me chalayein ya .APK package download karein.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-xs shrink-0 whitespace-nowrap self-stretch sm:self-auto justify-center"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Install / APK Dekhein</span>
          </button>
        </div>
      )}

      {/* CORE USER PROMPT REQUIREMENTS: 3 Highlighted Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Kitne Paisay Thay (Opening Balance) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>{t('openingBalanceLabel', language)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
                {formatCurrency(dayLedger.openingBalance, currency)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t('openingBalanceSub', language)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <button
                onClick={onOpenSetBalance}
                className="text-[11px] text-slate-400 hover:text-slate-800 flex items-center gap-1 mt-1 transition-colors"
                title="Shuruati balance set ya adjust karein"
              >
                <Edit2 className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Aaj Kider Use Kiye (Today's Total Spend) */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
                <span>{t('todayExpensesLabel', language)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono tabular-nums mt-1">
                {formatCurrency(dayLedger.totalExpense, currency)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>{dayLedger.transactions.filter((t) => t.type === 'expense').length} Kharch Entries</span>
                {dailyExpenseBudget > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className={budgetUsedPercent > 100 ? 'text-rose-600 font-semibold' : ''}>
                      {budgetUsedPercent.toFixed(0)}% of daily target
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>

          {/* Quick progress against daily budget */}
          {dailyExpenseBudget > 0 && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  budgetUsedPercent > 100 ? 'bg-rose-600' : 'bg-slate-800'
                }`}
                style={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
              />
            </div>
          )}
        </div>

        {/* Card 3: Baqi Kitne Hain (Remaining Cash / Available Balance) */}
        <div className="bg-white rounded-2xl border border-slate-900 p-5 shadow-xs relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <span>{t('remainingBalanceLabel', language)}</span>
              </div>
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums mt-1 ${
                dayLedger.closingBalance < 0 ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {formatCurrency(dayLedger.closingBalance, currency)}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>{t('remainingBalanceSub', language)}</span>
                {dayLedger.totalIncome > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">
                      +{formatCurrency(dayLedger.totalIncome, currency)} Aamad
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal('expense')}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addExpense', language)}</span>
          </button>

          <button
            onClick={() => onOpenAddModal('income')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addIncome', language)}</span>
          </button>
        </div>

        {/* Payment mode snapshot */}
        {dayLedger.totalExpense > 0 && (
          <div className="flex items-center gap-3 text-xs text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl">
            <span className="font-semibold text-slate-800">Aaj ka zariya:</span>
            {paymentBreakdown.cash && (
              <span className="font-mono tabular-nums">
                Cash: {formatCurrency(paymentBreakdown.cash, currency)}
              </span>
            )}
            {paymentBreakdown.easypaisa_jazzcash && (
              <span className="font-mono tabular-nums">
                EasyPaisa/JazzCash: {formatCurrency(paymentBreakdown.easypaisa_jazzcash, currency)}
              </span>
            )}
            {paymentBreakdown.bank && (
              <span className="font-mono tabular-nums">
                Bank: {formatCurrency(paymentBreakdown.bank, currency)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* TODAY'S TRANSACTIONS LIST: "Kider Use Kiye" */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Aaj Ke Tamam Kharch Aur Aamad (Today's Detailed Ledger)
            </h3>
            <p className="text-xs text-slate-500">
              Jo jo raqam jahan use hui ya aayi, waqt aur category ke sath
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            {dayLedger.transactions.length} Records
          </span>
        </div>

        {dayLedger.transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {t('noTransactionsToday', language)}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {t('addFirstTodayPrompt', language)}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => onOpenAddModal('expense')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                + Kharcha Likhein
              </button>
              <button
                onClick={() => onOpenAddModal('income')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                + Aamad Likhein
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dayLedger.transactions.map((tx) => {
              const cat = categoryMap.get(tx.categoryId) || {
                id: tx.categoryId,
                name: tx.categoryId,
                nameRoman: tx.categoryId,
                nameUrdu: tx.categoryId,
                color: '#64748b',
                bgColor: 'bg-slate-50',
                textColor: 'text-slate-700',
                icon: 'CircleDollarSign',
              };

              const catName =
                language === 'urdu'
                  ? cat.nameUrdu
                  : language === 'roman_urdu'
                  ? cat.nameRoman
                  : cat.name;

              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Category Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {catName}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {tx.time}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {tx.paymentMethod === 'easypaisa_jazzcash'
                            ? 'EasyPaisa/JazzCash'
                            : tx.paymentMethod}
                        </span>
                      </div>

                      {/* Note / Detail */}
                      <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                        {tx.note || '(Koi note nahi likha)'}
                      </p>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div
                        className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                          isExpense ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatCurrency(tx.amount, currency)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isExpense ? 'Kharcha' : 'Aamad'}
                      </div>
                    </div>

                    {/* Edit / Delete Buttons */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Kya aap is entry ko delete karna chahte hain?')) {
                            onDeleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
