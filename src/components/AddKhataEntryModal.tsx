import React, { useState, useEffect } from 'react';
import { CurrencySymbol, KhataPerson, KhataTransaction, KhataType, PaymentMethod } from '../types';
import { formatCurrency, getTodayDateString, getCurrentTimeString } from '../utils/formatters';
import { X, ArrowUpRight, ArrowDownLeft, Calendar, Clock, FileText, Wallet, Check } from 'lucide-react';

interface AddKhataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  person: KhataPerson;
  currency: CurrencySymbol;
  initialType?: KhataType;
  editingTransaction?: KhataTransaction | null;
  onSave: (
    txData: Omit<KhataTransaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => void;
}

export const AddKhataEntryModal: React.FC<AddKhataEntryModalProps> = ({
  isOpen,
  onClose,
  person,
  currency,
  initialType = 'gave',
  editingTransaction,
  onSave,
}) => {
  const [type, setType] = useState<KhataType>(initialType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [time, setTime] = useState(getCurrentTimeString());
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [syncWithCash, setSyncWithCash] = useState(true);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || getCurrentTimeString());
      setNote(editingTransaction.note);
      setPaymentMethod(editingTransaction.paymentMethod || 'cash');
      setSyncWithCash(editingTransaction.syncWithCash ?? false);
    } else {
      setType(initialType);
      setAmount('');
      setDate(getTodayDateString());
      setTime(getCurrentTimeString());
      setNote('');
      setPaymentMethod('cash');
      setSyncWithCash(true);
    }
  }, [editingTransaction, initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    onSave(
      {
        personId: person.id,
        date,
        time,
        amount: numAmount,
        type,
        note: note.trim() || (type === 'gave' ? 'Pese diye / kharcha' : 'Wapis mile / hisaab'),
        paymentMethod,
        syncWithCash,
      },
      editingTransaction?.id
    );

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
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Khata Entry for
            </div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{person.name}</span>
              {person.role && (
                <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {person.role}
                </span>
              )}
            </h3>
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
          {/* Type Selector (Diye / Kharcha Kiya vs Liye / Wapis Aaye) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('gave')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                type === 'gave'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Maine Diye / Kharcha</span>
            </button>

            <button
              type="button"
              onClick={() => setType('received')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                type === 'received'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Usne Diye / Wapis</span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-center text-slate-500">
            {type === 'gave'
              ? `Aapne ${person.name} ko paise diye ya unke liye kharcha kiya (Aapko wapis lene hain)`
              : `${person.name} ne aapko paise wapis diye ya hisaab clear kiya`}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Raqam (Amount) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">
                {currency}
              </span>
              <input
                type="number"
                required
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                autoFocus
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tafseel / Note (Kis cheez ke hain)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  type === 'gave'
                    ? 'e.g. Ration ka kharcha, Bike ka petrol, Advance'
                    : 'e.g. Cash wapis diya, Hafta clear, JazzCash transfer'
                }
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Date & Time */}
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
                Waqt (Time)
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Payment Zareeya (Payment Mode)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                  paymentMethod === 'cash'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Cash
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa_jazzcash')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                  paymentMethod === 'easypaisa_jazzcash'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                EasyPaisa/Jazz
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors ${
                  paymentMethod === 'bank'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Bank
              </button>
            </div>
          </div>

          {/* Sync with Rozana Hisaab (Daily Cash Ledger) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncWithCash}
                onChange={(e) => setSyncWithCash(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 mt-0.5"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-900">
                  {type === 'gave'
                    ? 'Rozana Hisaab ke Cash se bhi katein?'
                    : 'Rozana Hisaab ke Cash mein bhi shamil karein?'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {type === 'gave'
                    ? 'Is se aapka daily "Aaj kider use kiye" kharcha bhi update ho jayega.'
                    : 'Is se aapki daily cash aamad aur baqi raqam barh jayegi.'}
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
              className={`flex-1 py-2.5 px-4 text-white rounded-xl text-xs font-bold transition-colors shadow-xs ${
                type === 'gave'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {type === 'gave' ? 'Diye / Kharcha Save' : 'Liye / Wapis Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
