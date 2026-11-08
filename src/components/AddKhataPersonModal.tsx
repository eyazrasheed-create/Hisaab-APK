import React, { useState, useEffect } from 'react';
import { KhataPerson } from '../types';
import { X, User, Phone, Briefcase, FileText } from 'lucide-react';

interface AddKhataPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personData: Omit<KhataPerson, 'id' | 'createdAt'>, initialBalance?: { amount: number; type: 'gave' | 'received' }) => void;
  editingPerson?: KhataPerson | null;
}

const COMMON_ROLES = [
  'Bhai / Family',
  'Worker / Mulazim',
  'Partner / Shareek',
  'Dost / Friend',
  'Customer / Grahak',
  'Supplier / Vendor',
  'Other',
];

export const AddKhataPersonModal: React.FC<AddKhataPersonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPerson,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Bhai / Family');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [hasInitialBalance, setHasInitialBalance] = useState(false);
  const [initialAmount, setInitialAmount] = useState('');
  const [initialType, setInitialType] = useState<'gave' | 'received'>('gave');

  useEffect(() => {
    if (editingPerson) {
      setName(editingPerson.name);
      setRole(editingPerson.role || 'Other');
      setPhone(editingPerson.phone || '');
      setNotes(editingPerson.notes || '');
      setHasInitialBalance(false);
      setInitialAmount('');
    } else {
      setName('');
      setRole('Bhai / Family');
      setPhone('');
      setNotes('');
      setHasInitialBalance(false);
      setInitialAmount('');
      setInitialType('gave');
    }
  }, [editingPerson, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let initBal: { amount: number; type: 'gave' | 'received' } | undefined = undefined;
    if (hasInitialBalance && Number(initialAmount) > 0) {
      initBal = {
        amount: Number(initialAmount),
        type: initialType,
      };
    }

    onSave(
      {
        name: name.trim(),
        role: role.trim(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      initBal
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {editingPerson ? 'Khata Edit Karein' : 'Naya Banda / Khata Kholein'}
              </h3>
              <p className="text-xs text-slate-500">
                Bhai, worker ya partner ka alag hisaab banayein
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
          {/* Person Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Naam (Person Name) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bhai (Usman), Ali Mazdoor, Rashid Partner"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                autoFocus
              />
            </div>
          </div>

          {/* Relationship / Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Rishta / Kaam (Role / Category)
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {COMMON_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile / Phone Number (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Mobile Number (WhatsApp k liye - Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0300-1234567"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Initial Balance toggle (only when creating new person) */}
          {!editingPerson && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInitialBalance}
                  onChange={(e) => setHasInitialBalance(e.target.checked)}
                  className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
                />
                <span className="text-xs font-bold text-slate-800">
                  Kya pehle ka koi purana hisaab baqi hai?
                </span>
              </label>

              {hasInitialBalance && (
                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setInitialType('gave')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors ${
                        initialType === 'gave'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Maine Lene Hain
                    </button>
                    <button
                      type="button"
                      onClick={() => setInitialType('received')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-colors ${
                        initialType === 'received'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Maine Dene Hain
                    </button>
                  </div>

                  <div>
                    <input
                      type="number"
                      min="1"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      placeholder="Purani baqi raqam (e.g. 5000)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Wazahat / Note (Optional)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Koi zaroori baat..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              />
            </div>
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
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              {editingPerson ? 'Save Changes' : 'Khata Kholein'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
