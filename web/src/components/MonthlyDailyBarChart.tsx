import React, { useState } from 'react';
import { CurrencySymbol } from '../types';
import { formatCurrency } from '../utils/formatters';

interface MonthlyDailyBarChartProps {
  dailyData: {
    date: string;
    dayNum: number;
    income: number;
    expense: number;
    net: number;
  }[];
  currency: CurrencySymbol;
  dailyBudget?: number;
  onSelectDay?: (date: string) => void;
}

export const MonthlyDailyBarChart: React.FC<MonthlyDailyBarChartProps> = ({
  dailyData,
  currency,
  dailyBudget = 2500,
  onSelectDay,
}) => {
  const [activeDay, setActiveDay] = useState<{
    date: string;
    dayNum: number;
    income: number;
    expense: number;
  } | null>(null);

  const maxExpense = Math.max(...dailyData.map((d) => d.expense), dailyBudget, 1000);

  return (
    <div className="space-y-3">
      {/* Chart Header info / Tooltip info */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs min-h-[24px]">
        {activeDay ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800">
              Tareekh: {activeDay.date}
            </span>
            <span className="text-rose-600 font-mono tabular-nums font-semibold">
              Kharcha: {formatCurrency(activeDay.expense, currency)}
            </span>
            {activeDay.income > 0 && (
              <span className="text-emerald-600 font-mono tabular-nums font-semibold">
                Aamad: +{formatCurrency(activeDay.income, currency)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-500">
            Kissi bhi din ke bar par hover ya click karein rozana tafseel dekhne ke liye:
          </span>
        )}

        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-rose-500 rounded-xs" />
            <span>Kharcha</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-xs" />
            <span>Aamad</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 border-t border-dashed border-amber-400" />
            <span>Budget Limit</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-4 pb-2 border-b border-slate-200">
        {/* Budget benchmark line */}
        {dailyBudget > 0 && (
          <div
            className="absolute left-0 right-0 border-b border-dashed border-amber-400 pointer-events-none z-10 flex items-center justify-end pr-1"
            style={{
              bottom: `${Math.min(92, Math.max(8, (dailyBudget / maxExpense) * 120))}px`,
            }}
          >
            <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-mono font-medium">
              Daily Target: {formatCurrency(dailyBudget, currency)}
            </span>
          </div>
        )}

        <div className="h-36 flex items-end gap-1 overflow-x-auto pb-1 pt-2">
          {dailyData.map((d) => {
            const expenseHeight = (d.expense / maxExpense) * 110;
            const isHovered = activeDay?.dayNum === d.dayNum;
            const isOverBudget = dailyBudget > 0 && d.expense > dailyBudget;

            return (
              <div
                key={d.dayNum}
                onClick={() => onSelectDay?.(d.date)}
                onMouseEnter={() => setActiveDay(d)}
                onMouseLeave={() => setActiveDay(null)}
                className="flex-1 min-w-[14px] flex flex-col items-center justify-end group cursor-pointer h-full"
              >
                {/* Visual bar container */}
                <div className="w-full flex items-end justify-center gap-0.5 h-full relative">
                  {/* Expense bar */}
                  <div
                    style={{ height: `${Math.max(expenseHeight > 0 ? 4 : 0, expenseHeight)}px` }}
                    className={`w-full max-w-[12px] rounded-t-xs transition-all duration-150 ${
                      isOverBudget
                        ? 'bg-rose-500 group-hover:bg-rose-600'
                        : d.expense > 0
                        ? 'bg-slate-400 group-hover:bg-slate-600'
                        : 'bg-transparent'
                    } ${isHovered ? 'ring-2 ring-slate-900 ring-offset-1' : ''}`}
                  />
                </div>

                {/* Day number */}
                <span
                  className={`text-[10px] font-mono mt-1 ${
                    d.dayNum % 5 === 0 || d.dayNum === 1
                      ? 'text-slate-600 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {d.dayNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
