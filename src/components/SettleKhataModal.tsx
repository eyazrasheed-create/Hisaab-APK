import React, { useState } from 'react';
import { CurrencySymbol, KhataPerson, KhataTransaction, PaymentMethod } from '../types';
import { formatCurrency, getTodayDateString, getCurrentTimeString } from '../utils/formatters';
import { X, CheckCircle2, Calendar, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface SettleKhataModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: KhataPerson;
  currentBalance: number; // positive = he owes you; negative = you owe him
  currency: CurrencySymbol;
  onSettle: (txData: Omit<KhataTransaction, 'id' | 'createdAt'>) => void;
}

export const SettleKhataModal: React.FC<SettleKhataModalProps> = ({
  isOpen,
  onClose,
  person,
  currentBalance,
  currency,
  onSettle,
}) => {
  const isHeOwing = currentBalance > 0;
  const absBalance = Math.abs(currentBalance);

  const [settleAmount, setSettleAmount] = useState<string>(String(absBalance));
  const [date, setDate] = useState(getTodayDateString());
  const [note, setNote] = useState('Hisaab Mukammal Clear / Settle Kiya');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [syncWithCash, setSyncWithCash] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(settleAmount);
    if (!amount || amount <= 0) return;

    // If he owes you (currentBalance > 0), settling means he pays you -> type = 'received'
    // If you owe him (currentBalance < 0), settling means you pay him -> type = 'gave'
    const type = isHeOwing ? 'received' : 'gave';

    onSettle({
      personId: person.id,
      date,
      time: getCurrentTimeString(),
      amount,
      type,
      note: note.trim() || 'Hisaab Clear Kiya',
      paymentMethod,
      syncWithCash,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hisaab Clear Karein (Settle Up)
              </h3>
              <p className="text-xs text-slate-500">
                {person.name} ke sath hisaab barabar karein
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current balance reminder */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              {isHeOwing ? 'Aapne Wapis Lene Hain (He Owes You)' : 'Aapne Dene Hain (You Owe Him)'}
            </div>
            <div className={`text-2xl font-black ${isHeOwing ? 'text-amber-600' : 'text-rose-600'}`}>
              {formatCurrency(absBalance, currency)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {isHeOwing
                ? `${person.name} yeh raqam ada karke hisaab 0 kar raha hai.`
                : `Aap yeh raqam ada karke hisaab 0 kar rahe hain.`}
            </div>
          </div>

          {/* Amount to settle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ada Ki Gai Raqam (Settlement Amount) *
              </label>
              <button
                type="button"
                onClick={() => setSettleAmount(String(absBalance))}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
              >
                Poora Clear ({formatCurrency(absBalance, currency)})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">
                {currency}
              </span>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                autoFocus
              />
            </div>
          </div>

          {/* Settlement Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Note / Detail
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Hafta mukammal clear, cash wapis diya"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tareekh (Date)
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Mode
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="cash">Cash</option>
                <option value="easypaisa_jazzcash">EasyPaisa / JazzCash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Sync toggle */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncWithCash}
                onChange={(e) => setSyncWithCash(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 mt-0.5"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">
                  Rozana Hisaab ke Cash mein bhi record karein?
                </span>
                <p className="text-[11px] text-slate-500">
                  {isHeOwing
                    ? 'Aapke pass cash aayega aur aaj ki aamad mein jud jayega.'
                    : 'Aapke cash se raqam nikal jayegi.'}
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hisaab Clear Karein</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
