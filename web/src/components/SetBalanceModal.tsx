import React, { useState } from 'react';
import { CurrencySymbol, Language } from '../types';
import { getTodayDateString } from '../utils/formatters';
import { X, Wallet } from 'lucide-react';

interface SetBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number, date: string) => void;
  currentInitialBalance: number;
  currentInitialDate: string;
  currency: CurrencySymbol;
  language: Language;
}

export const SetBalanceModal: React.FC<SetBalanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentInitialBalance,
  currentInitialDate,
  currency,
  language,
}) => {
  const [balance, setBalance] = useState<string>(String(currentInitialBalance || ''));
  const [date, setDate] = useState<string>(currentInitialDate || getTodayDateString());
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(balance);
    if (isNaN(parsed) || parsed < 0) {
      setError('Barahe karam sahi raqam darj karein (e.g. 20000 ya 50000)');
      return;
    }
    onSave(parsed, date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pehle Se Mojood Raqam (Opening Balance)
              </h3>
              <p className="text-xs text-slate-500">
                Total kitne paise thay aap ke paas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl text-xs text-emerald-800 space-y-1">
            <p className="font-semibold">Ye raqam kya hai?</p>
            <p className="text-[11px] leading-relaxed text-emerald-700">
              Aap jis din se hisaab shuru kar rahe hain, us din aap ke wallet ya bank me kul kitni raqam thi.
              Iske baad jo kharcha hoga wo minus hoga aur aamad add hoti rahegi.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Shuruati Raqam ({currency})
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
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-xl font-bold font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kis Tareekh Se Shuru Kiya (Start Date)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
            >
              Raqam Save Karein
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
