import React, { useState } from 'react';
import { Category, CurrencySymbol } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';

interface CategoryDonutChartProps {
  data: {
    category: Category;
    amount: number;
    percentage: number;
    transactionCount: number;
  }[];
  totalExpense: number;
  currency: CurrencySymbol;
  language: 'roman_urdu' | 'english' | 'urdu';
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  data,
  totalExpense,
  currency,
  language,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0 || totalExpense <= 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400 text-sm">
        <p>Is maheenay koi kharcha record nahi hua.</p>
      </div>
    );
  }

  // Pre-calculate SVG arcs
  const radius = 70;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = data.slice(0, 7).map((item, idx) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += item.percentage / 100;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: item.category.color || '#64748b',
      idx,
    };
  });

  const activeItem = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* Donut SVG */}
      <div className="md:col-span-5 flex flex-col items-center justify-center relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {slices.map((slice) => {
              const isHovered = hoveredIdx === slice.idx;
              return (
                <circle
                  key={slice.category.id}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(slice.idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Central readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeItem ? (
              <>
                <span className="text-xs text-slate-500 font-medium truncate max-w-[110px]">
                  {language === 'urdu'
                    ? activeItem.category.nameUrdu
                    : language === 'roman_urdu'
                    ? activeItem.category.nameRoman
                    : activeItem.category.name}
                </span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(activeItem.amount, currency)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {activeItem.percentage.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-500 font-medium">Kul Kharcha</span>
                <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(totalExpense, currency)}
                </span>
                <span className="text-xs text-slate-400">100%</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category breakdown list */}
      <div className="md:col-span-7 space-y-2.5">
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const displayName =
            language === 'urdu'
              ? item.category.nameUrdu
              : language === 'roman_urdu'
              ? item.category.nameRoman
              : item.category.name;

          return (
            <div
              key={item.category.id}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                isHovered ? 'bg-slate-50 border-slate-300' : 'border-transparent hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <span className="font-semibold text-slate-800 truncate">{displayName}</span>
                  <span className="text-slate-400 text-[11px]">({item.transactionCount} entries)</span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums shrink-0">
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  <span className="text-slate-500 text-[11px] w-9 text-right font-medium">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, item.percentage)}%`,
                    backgroundColor: item.category.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
