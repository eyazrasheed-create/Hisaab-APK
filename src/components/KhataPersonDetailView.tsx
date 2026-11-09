import React, { useState, useMemo, useRef } from 'react';
import { CurrencySymbol, KhataPerson, KhataTransaction } from '../types';
import { formatCurrency, formatDateStandard } from '../utils/formatters';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  Calendar,
  MessageSquare,
  MessageCircle,
  Search,
  ArrowUpDown,
  FileText,
  ChevronDown,
  Heart,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Phone,
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | '30days'>('all');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // Reminder Date State (Tareekh Rakhein)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState<string>(() => {
    return localStorage.getItem(`khata_reminder_${person.id}`) || '';
  });

  // Touch swipe-right gesture detector for mobile (Edge Swipe Back)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

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

  // Sort ascending chronologically to compute exact running balance
  const sortedAscending = useMemo(() => {
    const list = transactions.filter((t) => t.personId === person.id);
    return list.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || '').localeCompare(b.time || '');
    });
  }, [transactions, person.id]);

  // Compute totals and per-entry running balances
  const { totalGave, totalReceived, netBalance, transactionsWithBalance } = useMemo(() => {
    let gave = 0;
    let received = 0;
    let running = 0;

    const listWithBal = sortedAscending.map((tx) => {
      if (tx.type === 'gave') {
        gave += tx.amount;
        running += tx.amount; // Customer owes more
      } else {
        received += tx.amount;
        running -= tx.amount; // Customer paid down balance
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
      transactionsWithBalance: listWithBal,
    };
  }, [sortedAscending]);

  // Filter and sort for display
  const displayTransactions = useMemo(() => {
    let list = [...transactionsWithBalance];

    // Time filter
    if (timeFilter === 'month') {
      const currentMonth = new Date().toISOString().substring(0, 7);
      list = list.filter((t) => t.date.startsWith(currentMonth));
    } else if (timeFilter === '30days') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().substring(0, 10);
      list = list.filter((t) => t.date >= thirtyDaysAgo);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((t) => (t.note || '').toLowerCase().includes(query) || t.amount.toString().includes(query));
    }

    // Sort order (default newest first)
    return sortOrder === 'desc' ? list.reverse() : list;
  }, [transactionsWithBalance, timeFilter, searchQuery, sortOrder]);

  // Date format helpers
  const formatCustomerCreated = (ts?: number) => {
    if (!ts) return 'Apr 3, 2026';
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatEntryDate = (dateStr: string, timeStr?: string) => {
    try {
      const date = new Date(dateStr + 'T12:00:00');
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
      
      let formattedTime = '';
      if (timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        formattedTime = ` ${displayH}:${String(m).padStart(2, '0')}${ampm}`;
      }
      return `${day}${suffix} ${month}${formattedTime}`;
    } catch (e) {
      return dateStr;
    }
  };

  // WhatsApp reminder message
  const generateHisaabText = () => {
    const today = formatDateStandard(new Date().toISOString().substring(0, 10));
    let statusLine = '';
    if (netBalance > 0) {
      statusLine = `*Baqi Lene Hain: ${formatCurrency(netBalance, currency)}* (Aap ne ada karne hain)`;
    } else if (netBalance < 0) {
      statusLine = `*Baqi Dene Hain: ${formatCurrency(Math.abs(netBalance), currency)}* (Maine aapko dene hain)`;
    } else {
      statusLine = `*Hisaab Mukammal Clear Hai (Rs 0)* ✓`;
    }

    return `*Easy Khata Book - Hisaab Slip*\n👤 *Naam:* ${person.name}\n📅 *Tareekh:* ${today}\n📈 *Kul Diye:* ${formatCurrency(totalGave, currency)}\n📉 *Kul Liye:* ${formatCurrency(totalReceived, currency)}\n---------------------------------\n💰 ${statusLine}\n\n_Barahe karam hisaab check kar lein. Shukriya!_`;
  };

  const handleShareWhatsApp = () => {
    const text = generateHisaabText();
    const phoneClean = person.phone ? person.phone.replace(/[^0-9]/g, '') : '';
    const encoded = encodeURIComponent(text);
    const url = phoneClean ? `https://wa.me/${phoneClean}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleSendSMS = () => {
    const text = generateHisaabText();
    const phoneClean = person.phone ? person.phone.replace(/[^0-9]/g, '') : '';
    const url = `sms:${phoneClean}?body=${encodeURIComponent(text)}`;
    window.location.href = url;
  };

  const handleSaveReminder = (date: string) => {
    setReminderDate(date);
    if (date) {
      localStorage.setItem(`khata_reminder_${person.id}`, date);
    } else {
      localStorage.removeItem(`khata_reminder_${person.id}`);
    }
    setIsReminderModalOpen(false);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-white flex flex-col w-full max-w-full text-slate-900 pb-28 select-none"
    >
      {/* 1. TOP HEADER (Exact Match with Screenshot 2) */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-100 px-4 pt-7 sm:pt-4 pb-3 shadow-2xs">
        <div className="flex items-center justify-between">
          {/* Left: Back button + Name & Subtitle */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 text-slate-800 hover:text-slate-950 active:scale-95 transition-transform cursor-pointer"
              title="Wapis Jayein"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate leading-snug">
                {person.name}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium truncate">
                Customer since {formatCustomerCreated(person.createdAt)}
                {person.role ? ` • ${person.role}` : ''}
              </p>
            </div>
          </div>

          {/* Right: Heart favorite + Three dots options */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title="Favorite"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'
                }`}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                title="Options"
              >
                <MoreVertical className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenSettle();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Hisaab Settle Karein (0)</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onEditPerson(person);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4 text-sky-600" />
                      <span>Contact / Detail Badlein</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleExportPDF();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span>PDF Slip / Print Karein</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (window.confirm(`${person.name} ka khata delete karein? Tamam hisaab khatam ho jayega.`)) {
                          onDeletePerson(person.id);
                        }
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Customer Delete Karein</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATUS BANNER CARD (Exact Match with Screenshot 2) */}
      <div className="px-4 pt-3.5">
        {netBalance > 0 ? (
          <div className="bg-rose-50/70 border border-rose-100/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ArrowDown className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                {formatCurrency(netBalance, currency)}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-rose-700">
                Maine lene hain
              </span>
            </div>
          </div>
        ) : netBalance < 0 ? (
          <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <ArrowUp className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                {formatCurrency(Math.abs(netBalance), currency)}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-800">
                Maine dene hain
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-700">
              Hisaab Mukammal Clear Hai (Rs 0)
            </div>
          </div>
        )}
      </div>

      {/* 3. THREE ACTION BUTTONS (Tareekh Rakhein, SMS, WhatsApp) */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        {/* Tareekh Rakhein */}
        <button
          onClick={() => setIsReminderModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors shadow-2xs text-center cursor-pointer"
        >
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-600" />
            <Edit2 className="w-2.5 h-2.5 text-slate-600 absolute -right-1 -bottom-1" />
          </div>
          <span className="text-[11px] font-bold text-slate-700 leading-tight">
            {reminderDate ? `Tareekh: ${reminderDate}` : 'Tareekh Rakhein'}
          </span>
        </button>

        {/* SMS */}
        <button
          onClick={handleSendSMS}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors shadow-2xs text-center cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 text-sky-600" />
          <span className="text-[11px] font-bold text-slate-700 leading-tight">
            SMS
          </span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors shadow-2xs text-center cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-[11px] font-bold text-slate-700 leading-tight">
            WhatsApp
          </span>
        </button>
      </div>

      {/* 4. FILTER & TOOLS ROW (Exact Match with Screenshot 2) */}
      <div className="flex items-center justify-between px-4 py-1.5">
        {/* Left tool buttons */}
        <div className="flex items-center gap-2">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearching(!isSearching)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isSearching || searchQuery
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Search Entries"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Sort Date"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* PDF Export */}
          <button
            onClick={handleExportPDF}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="PDF Statement"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Live Khata Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs cursor-pointer hover:bg-slate-50"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {timeFilter === 'all'
                ? 'Live Khata'
                : timeFilter === 'month'
                ? 'Is Mahine'
                : '30 Din'}
            </span>
            <span className="text-[9px] font-black uppercase bg-sky-100 text-sky-700 px-1 py-0.2 rounded-xs">
              NEW
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isTimeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsTimeDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs font-semibold">
                <button
                  onClick={() => {
                    setTimeFilter('all');
                    setIsTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 ${
                    timeFilter === 'all' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  Tamam Entries (All)
                </button>
                <button
                  onClick={() => {
                    setTimeFilter('month');
                    setIsTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 ${
                    timeFilter === 'month' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  Is Mahine Ki
                </button>
                <button
                  onClick={() => {
                    setTimeFilter('30days');
                    setIsTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 ${
                    timeFilter === '30days' ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  Aakhri 30 Din
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Input Bar (when toggled) */}
      {isSearching && (
        <div className="px-4 py-2 bg-slate-50 border-y border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kharcha ya note search karein..."
            className="w-full text-xs font-medium bg-transparent focus:outline-hidden"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 5. COLUMN HEADERS (Exact Match with Screenshot 2) */}
      <div className="flex items-center justify-between px-4 py-2 border-y border-slate-100 bg-slate-50/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>TIME</span>
        <div className="flex items-center gap-14 sm:gap-24 pr-2">
          <span>DIYE</span>
          <span>LIYE</span>
        </div>
      </div>

      {/* 6. TRANSACTIONS LIST (Exact Match with Screenshot 2) */}
      <div className="px-4 divide-y divide-slate-100">
        {displayTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold">Koi hisaab entry nahi mili</p>
            <p className="text-[11px]">Neeche diye gaye buttons se pehli entry likhein</p>
          </div>
        ) : (
          displayTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => onEditEntry(tx)}
              className="py-3.5 flex items-start justify-between cursor-pointer hover:bg-slate-50/80 transition-colors -mx-2 px-2 rounded-xl group"
            >
              {/* Left Column: Arrow badge + Date/Time + Bal pill + Note */}
              <div className="flex items-start gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    tx.type === 'gave'
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {tx.type === 'gave' ? (
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">
                      {formatEntryDate(tx.date, tx.time)}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                        tx.runningBalance > 0
                          ? 'bg-rose-50 text-rose-700'
                          : tx.runningBalance < 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      Bal: {formatCurrency(Math.abs(tx.runningBalance), currency)}
                    </span>
                  </div>

                  {/* Note below */}
                  <div className="text-xs text-slate-500 mt-0.5 truncate font-medium">
                    {tx.note || (tx.type === 'gave' ? 'Cash diya' : 'Payment mili')}
                  </div>
                </div>
              </div>

              {/* Right Column: DIYE or LIYE amount */}
              <div className="text-right shrink-0 pt-0.5">
                {tx.type === 'gave' ? (
                  <div className="text-sm font-black text-rose-600 font-mono">
                    {formatCurrency(tx.amount, currency)}
                  </div>
                ) : (
                  <div className="text-sm font-black text-emerald-600 font-mono">
                    {formatCurrency(tx.amount, currency)}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 7. STICKY BOTTOM TWO BUTTONS (Exact Match with Screenshot 2) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center gap-3 max-w-7xl mx-auto shadow-lg">
        {/* Mainey Diye (Red Button) */}
        <button
          onClick={() => onOpenAddEntry('gave')}
          className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-[0.99] text-white font-extrabold rounded-2xl flex items-center justify-center gap-1.5 text-sm shadow-md transition-all cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 stroke-[3]" />
          <span>Mainey Diye</span>
        </button>

        {/* Mainey Liye (Green Button) */}
        <button
          onClick={() => onOpenAddEntry('received')}
          className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold rounded-2xl flex items-center justify-center gap-1.5 text-sm shadow-md transition-all cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 stroke-[3]" />
          <span>Mainey Liye</span>
        </button>
      </div>

      {/* Tareekh Rakhein Modal */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Wapsi Ki Tareekh Rakhein
              </h3>
              <button
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {person.name} ne kis tareekh ko hisaab clear karne ka wada kiya hai?
            </p>
            <input
              type="date"
              defaultValue={reminderDate || new Date().toISOString().substring(0, 10)}
              id="reminder-input"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSaveReminder('')}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Khatam Karein
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = (document.getElementById('reminder-input') as HTMLInputElement)?.value;
                  handleSaveReminder(val || '');
                }}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Tareekh Save Karein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
