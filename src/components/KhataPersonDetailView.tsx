import React, { useState, useMemo } from 'react';
import { CurrencySymbol, KhataPerson, KhataTransaction, PaymentMethod } from '../types';
import { formatCurrency, formatDateStandard } from '../utils/formatters';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Share2,
  Phone,
  Trash2,
  Edit2,
  Plus,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface KhataPersonDetailViewProps {
  person: KhataPerson;
  transactions: KhataTransaction[];
  currency: CurrencySymbol;
  onBack: () => void;
  onOpenAddEntry: (type: 'gave' | 'received') => void;
  onOpenSettle: () => void;
  onEditEntry: (tx: KhataTransaction) => void;
  onDeleteEntry: (txId: string) => void;
  onEditPerson: (person: KhataPerson) => void;
  onDeletePerson: (personId: string) => void;
}

export const KhataPersonDetailView: React.FC<KhataPersonDetailViewProps> = ({
  person,
  transactions,
  currency,
  onBack,
  onOpenAddEntry,
  onOpenSettle,
  onEditEntry,
  onDeleteEntry,
  onEditPerson,
  onDeletePerson,
}) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter transactions for this person and sort ascending for running balance calculation
  const sortedTransactions = useMemo(() => {
    const list = transactions.filter((t) => t.personId === person.id);
    return list.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || '').localeCompare(b.time || '');
    });
  }, [transactions, person.id]);

  // Calculate totals and running balance array
  const { totalGave, totalReceived, netBalance, transactionsWithBalance } = useMemo(() => {
    let gave = 0;
    let received = 0;
    let running = 0;

    const listWithBal = sortedTransactions.map((tx) => {
      if (tx.type === 'gave') {
        gave += tx.amount;
        running += tx.amount; // He owes you more
      } else {
        received += tx.amount;
        running -= tx.amount; // He paid down balance
      }

      return {
        ...tx,
        runningBalance: running,
      };
    });

    return {
      totalGave: gave,
      totalReceived: received,
      netBalance: running,
      transactionsWithBalance: listWithBal.reverse(), // Show newest first for table view
    };
  }, [sortedTransactions]);

  // Generate WhatsApp summary message
  const generateWhatsAppMessage = () => {
    const today = formatDateStandard(new Date().toISOString().substring(0, 10));
    let statusText = '';
    if (netBalance > 0) {
      statusText = `*Baqi Lene Hain: ${formatCurrency(netBalance, currency)}* (Aap ne ada karne hain)`;
    } else if (netBalance < 0) {
      statusText = `*Baqi Dene Hain: ${formatCurrency(Math.abs(netBalance), currency)}* (Maine aapko dene hain)`;
    } else {
      statusText = `*Hisaab Mukammal Clear Hai (0)* ✓`;
    }

    const message = `*Easy Khata Book - Khata Summary*
👤 *Naam:* ${person.name}
📅 *Tareekh:* ${today}

📈 *Kul Diye (Kharcha Kiya):* ${formatCurrency(totalGave, currency)}
📉 *Kul Liye (Wapis Mile):* ${formatCurrency(totalReceived, currency)}
---------------------------------
💰 ${statusText}

_Barahe karam hisaab check kar lein. Shukriya!_`;

    return message;
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppMessage();
    const encoded = encodeURIComponent(text);
    const phoneParam = person.phone ? person.phone.replace(/[^0-9]/g, '') : '';
    const url = phoneParam
      ? `https://wa.me/${phoneParam}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    
    // Attempt opening WhatsApp in new tab
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const text = generateWhatsAppMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Touch swipe-right gesture detector for mobile (Swipe Back like native Easy Khata)
  const touchStartXRef = React.useRef<number | null>(null);
  const touchStartYRef = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    const startedNearEdge = touchStartXRef.current < 70 && deltaX > 50;
    const strongSwipeRight = deltaX > 90;

    if ((startedNearEdge || strongSwipeRight) && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      onBack();
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="space-y-6 touch-pan-y"
    >
      {/* Top Navigation & Person Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Wapis Jayein (Back to Khata List)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {person.name}
              </h2>
              {person.role && (
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {person.role}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              {person.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{person.phone}</span>
                </span>
              )}
              {person.notes && (
                <span className="truncate max-w-xs text-slate-400">
                  "{person.notes}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Person Level Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            title="WhatsApp par summary bhejein"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Slip</span>
          </button>

          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Copy Text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => onEditPerson(person)}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Person Edit Karein"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            title="Khata Delete Karein"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete confirmation banner */}
      {showDeleteConfirm && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="text-xs text-rose-900">
              <span className="font-bold">Kya aap waqai {person.name} ka khata delete karna chahte hain?</span>
              <p className="text-rose-700 mt-0.5">Iske tamam purane transactions bhi delete ho jayenge.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-slate-700 rounded-lg border border-rose-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onDeletePerson(person.id)}
              className="px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
            >
              Haan, Delete Karein
            </button>
          </div>
        </div>
      )}

      {/* Main Balance Banner & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Net Status */}
        <div
          className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
            netBalance > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
              : netBalance < 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-950'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
          }`}
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-wider opacity-75">
              Current Khata Status
            </div>
            <div className="text-2xl sm:text-3xl font-black mt-1">
              {formatCurrency(Math.abs(netBalance), currency)}
            </div>
            <div className="text-xs font-bold mt-1">
              {netBalance > 0 && `Aapne ${person.name} se lene hain (He Owes You)`}
              {netBalance < 0 && `Aapne ${person.name} ko dene hain (You Owe Him)`}
              {netBalance === 0 && `Hisaab Mukammal Clear Hai (Settled)`}
            </div>
          </div>

          {netBalance !== 0 && (
            <div className="pt-4 mt-2 border-t border-current/10">
              <button
                onClick={onOpenSettle}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hisaab Clear Karein (Settle Up)</span>
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Total Diye (Kharcha Kiya) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kul Maine Diye (Spent)
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {formatCurrency(totalGave, currency)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Jo paise aapne diye ya unpar kharch kiye
            </div>
          </div>

          <button
            onClick={() => onOpenAddEntry('gave')}
            className="w-full mt-4 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Maine Diye (Kharcha Likhein)</span>
          </button>
        </div>

        {/* Card 3: Total Liye (Wapis Aaye) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kul Usne Diye (Received)
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {formatCurrency(totalReceived, currency)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Jo paise usne wapis kiye ya ada kiye
            </div>
          </div>

          <button
            onClick={() => onOpenAddEntry('received')}
            className="w-full mt-4 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Usne Diye (Wapis Aaye)</span>
          </button>
        </div>
      </div>

      {/* Ledger Table: Transactions History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-slate-600" />
              <span>Hisaab-Kitaab Ledger ({transactionsWithBalance.length} Entries)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Tafseel ke sath kharche aur wapis aane wali raqam
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddEntry('gave')}
              className="px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Diye</span>
            </button>
            <button
              onClick={() => onOpenAddEntry('received')}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Liye</span>
            </button>
          </div>
        </div>

        {transactionsWithBalance.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700">Abhi koi entry nahi hai</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Jab aap {person.name} ko paise dein ya unke liye kharcha karein toh ooper diye gaye button se record karein.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Tareekh (Date)</th>
                  <th className="py-3 px-4">Tafseel / Note</th>
                  <th className="py-3 px-4">Mode / Cash Sync</th>
                  <th className="py-3 px-4 text-right text-amber-700">Maine Diye (Gave)</th>
                  <th className="py-3 px-4 text-right text-emerald-700">Usne Diye (Got)</th>
                  <th className="py-3 px-4 text-right">Baqi Hisaab</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactionsWithBalance.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    {/* Date */}
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      <div>{formatDateStandard(tx.date)}</div>
                      {tx.time && <div className="text-[10px] text-slate-400">{tx.time}</div>}
                    </td>

                    {/* Note / Description */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{tx.note}</span>
                      </div>
                    </td>

                    {/* Payment Mode & Cash Sync */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {tx.paymentMethod === 'easypaisa_jazzcash'
                            ? 'Jazz/Easy'
                            : tx.paymentMethod || 'Cash'}
                        </span>
                        {tx.syncWithCash && (
                          <span
                            className="text-[9px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded"
                            title="Rozana Cash Ledger se linked hai"
                          >
                            Daily Cash
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Maine Diye (Gave) */}
                    <td className="py-3 px-4 text-right font-bold text-amber-600 whitespace-nowrap text-sm">
                      {tx.type === 'gave' ? formatCurrency(tx.amount, currency) : '-'}
                    </td>

                    {/* Usne Diye (Received) */}
                    <td className="py-3 px-4 text-right font-bold text-emerald-600 whitespace-nowrap text-sm">
                      {tx.type === 'received' ? formatCurrency(tx.amount, currency) : '-'}
                    </td>

                    {/* Running Balance */}
                    <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs ${
                          tx.runningBalance > 0
                            ? 'bg-amber-50 text-amber-700 font-bold'
                            : tx.runningBalance < 0
                            ? 'bg-rose-50 text-rose-700 font-bold'
                            : 'bg-emerald-50 text-emerald-700 font-bold'
                        }`}
                      >
                        {tx.runningBalance === 0
                          ? '0 (Clear)'
                          : tx.runningBalance > 0
                          ? `+${formatCurrency(tx.runningBalance, currency)} (Lene)`
                          : `-${formatCurrency(Math.abs(tx.runningBalance), currency)} (Dene)`}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditEntry(tx)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Edit Entry"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEntry(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar - Authentic Easy Khata 2-Button Pattern */}
      <div className="sticky bottom-0 -mx-3 sm:-mx-6 lg:-mx-8 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-30">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          {/* Red Button: Maine Diye (You Gave / Kharcha Kiya) */}
          <button
            onClick={() => onOpenAddEntry('gave')}
            className="flex-1 py-3 sm:py-3.5 px-3 sm:px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 sm:w-5 h-5 shrink-0" />
            <span>- Maine Diye (You Gave)</span>
          </button>

          {/* Green Button: Maine Liye (You Received / Wapis Mile) */}
          <button
            onClick={() => onOpenAddEntry('received')}
            className="flex-1 py-3 sm:py-3.5 px-3 sm:px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 sm:w-5 h-5 shrink-0" />
            <span>+ Maine Liye (You Got)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
