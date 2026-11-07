import React, { useState } from 'react';
import { AppSettings, Category, MonthlyStats, Transaction } from '../types';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryDonutChart } from './CategoryDonutChart';
import { MonthlyDailyBarChart } from './MonthlyDailyBarChart';
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  CalendarDays,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';

interface MonthlySummaryViewProps {
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  monthlyStats: MonthlyStats;
  categories: Category[];
  settings: AppSettings;
  onSelectDay: (date: string) => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
}

export const MonthlySummaryView: React.FC<MonthlySummaryViewProps> = ({
  selectedMonth,
  setSelectedMonth,
  monthlyStats,
  categories,
  settings,
  onSelectDay,
  onOpenAddModal,
}) => {
  const { language, currency, dailyExpenseBudget = 2500 } = settings;
  const [activeLedgerTab, setActiveLedgerTab] = useState<'categories' | 'trends' | 'sheet'>('categories');

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const handleShiftMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const monthLabel = `${getMonthName(month, language)} ${year}`;

  return (
    <div className="space-y-6">
      {/* Month Selector Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShiftMonth(-1)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Pichla Maheena"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{monthLabel}</span>
              <span className="text-xs text-slate-500 font-normal">
                ({monthlyStats.daysWithTransactions} din active)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Mahana Kharcha, Aamad Aur Bachat Ka Mukammal Khulasa
            </p>
          </div>

          <button
            onClick={() => handleShiftMonth(1)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Agla Maheena"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Month selector dropdown */}
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden hover:bg-slate-100 cursor-pointer"
          />
        </div>
      </div>

      {/* Monthly KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Kul Aamad */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{t('monthTotalIncome', language)}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-2">
            {formatCurrency(monthlyStats.totalIncome, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Salary, client payments, etc.</p>
        </div>

        {/* KPI 2: Kul Kharcha */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{t('monthTotalExpense', language)}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono tabular-nums mt-2">
            {formatCurrency(monthlyStats.totalExpense, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Tamam categories ka total</p>
        </div>

        {/* KPI 3: Net Bachat (Savings) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{t('monthNetSavings', language)}</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-extrabold font-mono tabular-nums mt-2 ${
            monthlyStats.netSavings >= 0 ? 'text-slate-900' : 'text-rose-600'
          }`}>
            {formatCurrency(monthlyStats.netSavings, currency)}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {monthlyStats.totalIncome > 0
              ? `${monthlyStats.savingsRate.toFixed(1)}% bachat shuda`
              : 'Aamad minus kharcha'}
          </p>
        </div>

        {/* KPI 4: Rozana Ausat Kharcha */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>{t('dailyAverage', language)}</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
            {formatCurrency(monthlyStats.dailyAverageSpend, currency)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Per active day average</p>
        </div>
      </div>

      {/* Segmented View Switcher: Categories vs Daily Trends vs Day-by-day Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex items-center gap-1.5">
        <button
          onClick={() => setActiveLedgerTab('categories')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeLedgerTab === 'categories'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Categories Ka Khulasa (Spending Breakdown)
        </button>

        <button
          onClick={() => setActiveLedgerTab('trends')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeLedgerTab === 'trends'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Rozana Kharch Trend (Daily Graph)
        </button>

        <button
          onClick={() => setActiveLedgerTab('sheet')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            activeLedgerTab === 'sheet'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Rozana Hisaab Sheet (Day Table)
        </button>
      </div>

      {/* VIEW A: Category Breakdown */}
      {activeLedgerTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('categoryBreakdownTitle', language)}
            </h3>
            <p className="text-xs text-slate-500">
              Har category me kul kitna kharcha hua aur percentage hissa
            </p>
          </div>

          <CategoryDonutChart
            data={monthlyStats.categoryBreakdown}
            totalExpense={monthlyStats.totalExpense}
            currency={currency}
            language={language}
          />

          {/* Budget Limit Warnings if any category exceeded budget */}
          {monthlyStats.categoryBreakdown.some((c) => c.budgetUsedPercent && c.budgetUsedPercent > 100) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <h4 className="text-xs font-bold text-amber-900">
                Budget Alert: Kuch categories limit se tajawuz kar gayin!
              </h4>
              <div className="text-xs text-amber-800 space-y-0.5">
                {monthlyStats.categoryBreakdown
                  .filter((c) => c.budgetUsedPercent && c.budgetUsedPercent > 100)
                  .map((item) => (
                    <div key={item.category.id} className="flex items-center justify-between">
                      <span>• {item.category.nameRoman || item.category.name}</span>
                      <span className="font-mono font-bold">
                        {item.budgetUsedPercent?.toFixed(0)}% used (Limit: {formatCurrency(item.budgetLimit || 0, currency)})
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: Daily Graph */}
      {activeLedgerTab === 'trends' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('dailyTrendsTitle', language)}
            </h3>
            <p className="text-xs text-slate-500">
              Is maheenay kis din zyada kharcha hua aur kis din kam
            </p>
          </div>

          <MonthlyDailyBarChart
            dailyData={monthlyStats.dailyBreakdown}
            currency={currency}
            dailyBudget={dailyExpenseBudget}
            onSelectDay={onSelectDay}
          />
        </div>
      )}

      {/* VIEW C: Day-by-Day Sheet Table */}
      {activeLedgerTab === 'sheet' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('dayWiseLedgerTitle', language)}
              </h3>
              <p className="text-xs text-slate-500">
                Maheenay ke har din ka aaghaz, aamad, kharcha aur baqi raqam
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Din / Tareekh</th>
                  <th className="py-3 px-4 text-right">Aamad (In)</th>
                  <th className="py-3 px-4 text-right">Kharcha (Out)</th>
                  <th className="py-3 px-4 text-right">Net Change</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {monthlyStats.dailyBreakdown
                  .filter((d) => d.expense > 0 || d.income > 0)
                  .map((d) => (
                    <tr key={d.date} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                        {d.date}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">
                        {d.income > 0 ? `+${formatCurrency(d.income, currency)}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-600 font-semibold">
                        {d.expense > 0 ? `-${formatCurrency(d.expense, currency)}` : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${
                        d.net > 0 ? 'text-emerald-700' : d.net < 0 ? 'text-rose-700' : 'text-slate-400'
                      }`}>
                        {d.net !== 0 ? formatCurrency(d.net, currency) : '0'}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        <button
                          onClick={() => onSelectDay(d.date)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                        >
                          <span>Din Dekhein</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {monthlyStats.dailyBreakdown.every((d) => d.expense === 0 && d.income === 0) && (
              <div className="p-8 text-center text-slate-400 text-xs">
                Is maheenay me abhi tak koi records nahi hain.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
