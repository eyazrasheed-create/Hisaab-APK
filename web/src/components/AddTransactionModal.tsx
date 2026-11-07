import React, { useState, useEffect } from 'react';
import { Category, CurrencySymbol, Language, PaymentMethod, Transaction, TransactionType } from '../types';
import { PAYMENT_METHODS, QUICK_AMOUNTS } from '../utils/constants';
import { getCurrentTimeString, getTodayDateString } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryIcon } from './CategoryIcon';
import { X, Plus, Check } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>, existingId?: string) => void;
  categories: Category[];
  currency: CurrencySymbol;
  language: Language;
  defaultDate?: string;
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  currency,
  language,
  defaultDate,
  initialType = 'expense',
  editingTransaction = null,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [date, setDate] = useState<string>(defaultDate || getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setCategoryId(editingTransaction.categoryId);
      setPaymentMethod(editingTransaction.paymentMethod);
      setDate(editingTransaction.date);
      setTime(editingTransaction.time);
      setNote(editingTransaction.note);
    } else {
      setType(initialType);
      setAmount('');
      setCategoryId(initialType === 'income' ? 'income_general' : 'food');
      setPaymentMethod('cash');
      setDate(defaultDate || getTodayDateString());
      setTime(getCurrentTimeString());
      setNote('');
    }
    setError('');
  }, [editingTransaction, initialType, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Barahe karam sahi raqam (valid positive amount) darj karein.');
      return;
    }

    if (!categoryId) {
      setError('Koi category select karein.');
      return;
    }

    onSave(
      {
        date,
        time: time || getCurrentTimeString(),
        type,
        amount: parsedAmount,
        categoryId,
        paymentMethod,
        note: note.trim(),
      },
      editingTransaction ? editingTransaction.id : undefined
    );

    onClose();
  };

  const handleQuickAdd = (value: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + value));
  };

  const commonNotesSuggestions =
    type === 'expense'
      ? ['Chai & Nashta', 'Bike/Car Petrol', 'Dopahar Ka Khana', 'Ghar Ka Sauda', 'Mobile Load', 'Sabzi & Phal', 'Medical Store']
      : ['Salary / Tankhwah', 'Client Payment', 'Udhaar Wapas Mila', 'Daily Kamai / Profit', 'Pocket Money / Inam'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingTransaction
                ? 'Entry Edit Karein'
                : type === 'expense'
                ? 'Naya Kharcha (Add Expense)'
                : 'Nayi Aamad (Add Income)'}
            </h3>
            <p className="text-xs text-slate-500">
              {type === 'expense'
                ? 'Kider kitne paisay kharch huay darj karein'
                : 'Aane wali raqam ya salary ka record rakhein'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Type Switcher */}
          {!editingTransaction && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategoryId('food');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kharcha (Spend)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategoryId('income_general');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aamad (Income)
              </button>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('amount', language)} ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-xl font-bold font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Quick add buttons */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 mr-1 shrink-0 font-medium">+ Add:</span>
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="px-2.5 py-1 text-xs font-mono font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md shrink-0 transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('category', language)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
              {categories
                .filter((c) => (type === 'income' ? c.id === 'income_general' || c.id === 'debt' || c.isCustom : true))
                .map((cat) => {
                  const isSelected = categoryId === cat.id;
                  const catLabel =
                    language === 'urdu'
                      ? cat.nameUrdu
                      : language === 'roman_urdu'
                      ? cat.nameRoman
                      : cat.name;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs transition-all ${
                        isSelected
                          ? 'bg-white font-bold text-slate-900 shadow-sm ring-1 ring-slate-900'
                          : 'hover:bg-slate-200/60 text-slate-600'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: cat.color }}
                      >
                        <CategoryIcon name={cat.icon} className="w-3 h-3" />
                      </div>
                      <span className="truncate">{catLabel}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t('paymentMethod', language)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PAYMENT_METHODS.map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const label =
                  language === 'urdu'
                    ? pm.labelUrdu
                    : language === 'roman_urdu'
                    ? pm.labelRoman
                    : pm.labelEn;

                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`px-3 py-2 text-xs rounded-lg border text-left truncate transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('date', language)}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('time', language)}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('note', language)}
            </label>
            <input
              type="text"
              placeholder="e.g. Chai nashta, petrol, dukaan ka bill..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />

            {/* Note suggestion tags */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {commonNotesSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setNote(suggestion)}
                  className="px-2 py-0.5 text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 text-xs font-semibold text-white rounded-lg transition-all shadow-sm ${
                type === 'expense'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {editingTransaction ? 'Update Entry' : t('save', language)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
