import React, { useState, useMemo } from 'react';
import { AppSettings, Category, PaymentMethod, Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit2,
  ArrowUpDown,
  Calendar,
} from 'lucide-react';

interface AllTransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onExportCSV: () => void;
  onSelectDay: (date: string) => void;
}

export const AllTransactionsView: React.FC<AllTransactionsViewProps> = ({
  transactions,
  categories,
  settings,
  onEditTransaction,
  onDeleteTransaction,
  onExportCSV,
  onSelectDay,
}) => {
  const { language, currency } = settings;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search note or category
      if (searchTerm) {
        const cat = categoryMap.get(tx.categoryId);
        const searchLower = searchTerm.toLowerCase();
        const noteMatch = tx.note?.toLowerCase().includes(searchLower);
        const catMatch =
          cat?.name.toLowerCase().includes(searchLower) ||
          cat?.nameRoman.toLowerCase().includes(searchLower) ||
          cat?.nameUrdu.includes(searchTerm);
        if (!noteMatch && !catMatch) return false;
      }

      // Filter category
      if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) {
        return false;
      }

      // Filter type
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      // Filter payment method
      if (selectedPayment !== 'all' && tx.paymentMethod !== selectedPayment) {
        return false;
      }

      // Filter date range
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      return true;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType, selectedPayment, startDate, endDate, categoryMap]);

  const totalFilteredExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', language)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Export to CSV Button */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">Sab Qisam (All Types)</option>
            <option value="expense">Sirf Kharcha (Expenses)</option>
            <option value="income">Sirf Aamad (Income)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">Sab Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'urdu' ? c.nameUrdu : language === 'roman_urdu' ? c.nameRoman : c.name}
              </option>
            ))}
          </select>

          {/* Payment Method */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">Sab Zariye (All Modes)</option>
            <option value="cash">Cash (Naqad)</option>
            <option value="easypaisa_jazzcash">EasyPaisa / JazzCash</option>
            <option value="bank">Bank Transfer</option>
            <option value="card">Card</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedType('all');
              setSelectedPayment('all');
              setStartDate('');
              setEndDate('');
            }}
            className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-center font-medium"
          >
            Filters Reset
          </button>
        </div>
      </div>

      {/* Filter Stats Pill */}
      <div className="flex items-center justify-between text-xs px-2 text-slate-500">
        <span>{filteredTransactions.length} entries mili hain</span>
        <div className="flex items-center gap-3 font-mono tabular-nums">
          <span className="text-rose-600 font-semibold">
            Kharcha: -{formatCurrency(totalFilteredExpense, currency)}
          </span>
          {totalFilteredIncome > 0 && (
            <span className="text-emerald-600 font-semibold">
              Aamad: +{formatCurrency(totalFilteredIncome, currency)}
            </span>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tareekh / Waqt</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Tafseel (Note)</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4 text-right">Raqam</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
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
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <div className="font-semibold text-slate-900 cursor-pointer hover:underline" onClick={() => onSelectDay(tx.date)}>
                        {tx.date}
                      </div>
                      <div className="text-[11px] text-slate-400">{tx.time}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: cat.color }}
                        >
                          <CategoryIcon name={cat.icon} className="w-3 h-3" />
                        </div>
                        <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                          {catName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium max-w-xs truncate">
                      {tx.note || '-'}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {tx.paymentMethod === 'easypaisa_jazzcash' ? 'EasyPaisa' : tx.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span
                        className={`font-bold ${
                          isExpense ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this entry?')) {
                              onDeleteTransaction(tx.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Koi record match nahi hua. Filters check karein.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
