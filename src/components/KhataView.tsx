import React, { useState, useMemo } from 'react';
import { CurrencySymbol, KhataPerson, KhataTransaction, PersonBalance } from '../types';
import { calculateAllKhataStats, calculatePersonBalance } from '../utils/storage';
import { formatCurrency, formatDateStandard } from '../utils/formatters';
import {
  Users,
  UserPlus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Phone,
  ChevronRight,
  Filter,
  DollarSign,
  Briefcase,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { KhataPersonDetailView } from './KhataPersonDetailView';
import { AddKhataPersonModal } from './AddKhataPersonModal';
import { AddKhataEntryModal } from './AddKhataEntryModal';
import { SettleKhataModal } from './SettleKhataModal';
import { useMobileBackHandler } from '../hooks/useMobileBackGesture';

interface KhataViewProps {
  persons: KhataPerson[];
  khataTransactions: KhataTransaction[];
  currency: CurrencySymbol;
  onSavePerson: (personData: Omit<KhataPerson, 'id' | 'createdAt'>, initialBalance?: { amount: number; type: 'gave' | 'received' }) => void;
  onUpdatePerson: (person: KhataPerson) => void;
  onDeletePerson: (personId: string) => void;
  onSaveKhataTransaction: (
    txData: Omit<KhataTransaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => void;
  onDeleteKhataTransaction: (txId: string) => void;
}

export const KhataView: React.FC<KhataViewProps> = ({
  persons,
  khataTransactions,
  currency,
  onSavePerson,
  onUpdatePerson,
  onDeletePerson,
  onSaveKhataTransaction,
  onDeleteKhataTransaction,
}) => {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'receivable' | 'payable' | 'settled'>('all');

  // Modals state
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<KhataPerson | null>(null);

  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [entryType, setEntryType] = useState<'gave' | 'received'>('gave');
  const [entryPerson, setEntryPerson] = useState<KhataPerson | null>(null);
  const [editingEntry, setEditingEntry] = useState<KhataTransaction | null>(null);

  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [settlePerson, setSettlePerson] = useState<KhataPerson | null>(null);

  // Handle Android edge gesture back and mobile back button navigation
  useMobileBackHandler(Boolean(selectedPersonId), () => setSelectedPersonId(null), 'person-detail');
  useMobileBackHandler(isAddPersonOpen, () => setIsAddPersonOpen(false), 'add-person-modal');
  useMobileBackHandler(isAddEntryOpen, () => { setIsAddEntryOpen(false); setEditingEntry(null); }, 'add-entry-modal');
  useMobileBackHandler(isSettleOpen, () => setIsSettleOpen(false), 'settle-modal');

  // Overall stats
  const stats = useMemo(() => {
    return calculateAllKhataStats(persons, khataTransactions);
  }, [persons, khataTransactions]);

  // Filtered persons
  const filteredBalances = useMemo(() => {
    return stats.balances.filter((item) => {
      // Search filter
      const matchesSearch =
        item.person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.person.phone && item.person.phone.includes(searchQuery)) ||
        (item.person.role && item.person.role.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Status filter
      if (filterType === 'receivable') return item.status === 'receivable';
      if (filterType === 'payable') return item.status === 'payable';
      if (filterType === 'settled') return item.status === 'settled';

      return true;
    });
  }, [stats.balances, searchQuery, filterType]);

  // If a person is currently selected, show the Detail View
  const selectedPerson = persons.find((p) => p.id === selectedPersonId);

  if (selectedPerson) {
    const selectedBal = calculatePersonBalance(selectedPerson, khataTransactions);

    return (
      <>
        <KhataPersonDetailView
          person={selectedPerson}
          transactions={khataTransactions}
          currency={currency}
          onBack={() => setSelectedPersonId(null)}
          onOpenAddEntry={(type) => {
            setEntryPerson(selectedPerson);
            setEntryType(type);
            setEditingEntry(null);
            setIsAddEntryOpen(true);
          }}
          onOpenSettle={() => {
            setSettlePerson(selectedPerson);
            setIsSettleOpen(true);
          }}
          onEditEntry={(tx) => {
            setEntryPerson(selectedPerson);
            setEditingEntry(tx);
            setIsAddEntryOpen(true);
          }}
          onDeleteEntry={onDeleteKhataTransaction}
          onEditPerson={(p) => {
            setEditingPerson(p);
            setIsAddPersonOpen(true);
          }}
          onDeletePerson={(id) => {
            onDeletePerson(id);
            setSelectedPersonId(null);
          }}
        />

        {/* Entry Modal */}
        {entryPerson && (
          <AddKhataEntryModal
            isOpen={isAddEntryOpen}
            onClose={() => {
              setIsAddEntryOpen(false);
              setEditingEntry(null);
            }}
            person={entryPerson}
            currency={currency}
            initialType={entryType}
            editingTransaction={editingEntry}
            onSave={onSaveKhataTransaction}
          />
        )}

        {/* Settle Modal */}
        {settlePerson && (
          <SettleKhataModal
            isOpen={isSettleOpen}
            onClose={() => setIsSettleOpen(false)}
            person={settlePerson}
            currentBalance={selectedBal.netBalance}
            currency={currency}
            onSettle={onSaveKhataTransaction}
          />
        )}

        {/* Person Edit Modal */}
        <AddKhataPersonModal
          isOpen={isAddPersonOpen}
          onClose={() => {
            setIsAddPersonOpen(false);
            setEditingPerson(null);
          }}
          editingPerson={editingPerson}
          onSave={(personData) => {
            if (editingPerson) {
              onUpdatePerson({ ...editingPerson, ...personData });
            }
          }}
        />
      </>
    );
  }

  // Otherwise, show Main Khata Dashboard & Person List
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-12">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Easy Khata (Logon Ka Hisaab)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bhai, doston, karigaron aur grahakon ka alag alag digital ledger
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPerson(null);
            setIsAddPersonOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-white" />
          <span>+ Naya Banda / Customer Add Karein</span>
        </button>
      </div>

      {/* Authentic Easy Khata Summary Card (Split Banner) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-slate-100 p-4 sm:p-6">
          {/* Left: Maine Lene Hain (You Will Get) */}
          <div className="pr-2 sm:pr-4">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Maine Lene Hain</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-emerald-700 mt-1 font-mono tracking-tight">
              {formatCurrency(stats.totalReceivable, currency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.activeCount} logon se wapis lene hain
            </div>
          </div>

          {/* Right: Maine Dene Hain (You Will Give) */}
          <div className="pl-3 sm:pl-5">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Maine Dene Hain</span>
            </div>
            <div className="text-xl sm:text-3xl font-black text-rose-600 mt-1 font-mono tracking-tight">
              {formatCurrency(stats.totalPayable, currency)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Baqi ada karne hain
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quick summary line */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium text-[11px]">
            Kul Khatay: <strong>{persons.length}</strong> · Net Baqi: <strong className={stats.netKhataBalance >= 0 ? 'text-emerald-700' : 'text-rose-600'}>{formatCurrency(stats.netKhataBalance, currency)}</strong>
          </span>
          <button
            onClick={() => {
              const text = `*Easy Khata Book - Summary*\n👥 Kul Log: ${persons.length}\n🟢 Lene Hain: ${formatCurrency(stats.totalReceivable, currency)}\n🔴 Dene Hain: ${formatCurrency(stats.totalPayable, currency)}\n💰 Net Hisaab: ${formatCurrency(stats.netKhataBalance, currency)}`;
              navigator.clipboard.writeText(text);
              alert('Khata Summary Copy Ho Gayi Hai!');
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Summary</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Naam, phone ya role search karein..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sab Log ({persons.length})
          </button>

          <button
            onClick={() => setFilterType('receivable')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
              filterType === 'receivable'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Lene Hain
          </button>

          <button
            onClick={() => setFilterType('payable')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
              filterType === 'payable'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Dene Hain
          </button>

          <button
            onClick={() => setFilterType('settled')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
              filterType === 'settled'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Clear (0)
          </button>
        </div>
      </div>

      {/* Person Cards Grid */}
      {filteredBalances.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-3 text-slate-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Koi Khata Nahi Mila</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `"${searchQuery}" ke naam se koi khata nahi mila.`
              : 'Apne bhai, karigar ya doston ka hisaab alag rakhne ke liye naya khata kholein.'}
          </p>
          <button
            onClick={() => {
              setEditingPerson(null);
              setIsAddPersonOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            + Naya Khata Kholein
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBalances.map((item) => {
            const { person, netBalance, totalGave, totalReceived, transactionCount, lastTransactionDate } = item;
            const initialLetter = person.name.charAt(0).toUpperCase();

            return (
              <div
                key={person.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
                onClick={() => setSelectedPersonId(person.id)}
              >
                {/* Card Top: Person Info & Role */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
                        {initialLetter}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {person.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          {person.role && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {person.role}
                            </span>
                          )}
                          {person.phone && (
                            <span className="flex items-center gap-0.5 text-[11px] text-slate-400">
                              <Phone className="w-3 h-3" />
                              <span>{person.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                  </div>

                  {/* Balance Display */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-medium text-slate-400 mb-1">
                      {netBalance > 0
                        ? 'Aapne Wapis Lene Hain (Receivable)'
                        : netBalance < 0
                        ? 'Aapne Dene Hain (Payable)'
                        : 'Hisaab Status'}
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div
                        className={`text-xl font-black ${
                          netBalance > 0
                            ? 'text-amber-600'
                            : netBalance < 0
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {netBalance === 0
                          ? '✓ Clear (Rs 0)'
                          : formatCurrency(Math.abs(netBalance), currency)}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          netBalance > 0
                            ? 'bg-amber-100 text-amber-800'
                            : netBalance < 0
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {netBalance > 0 ? 'Lene Hain' : netBalance < 0 ? 'Dene Hain' : 'Clear'}
                      </span>
                    </div>

                    {/* Small stats */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-50 text-[11px] text-slate-500">
                      <div>
                        <span>Diye: </span>
                        <span className="font-bold text-slate-800">
                          {formatCurrency(totalGave, currency)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span>Liye: </span>
                        <span className="font-bold text-slate-800">
                          {formatCurrency(totalReceived, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: Quick Actions */}
                <div
                  className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setEntryPerson(person);
                      setEntryType('gave');
                      setEditingEntry(null);
                      setIsAddEntryOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Diye</span>
                  </button>

                  <button
                    onClick={() => {
                      setEntryPerson(person);
                      setEntryType('received');
                      setEditingEntry(null);
                      setIsAddEntryOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Liye</span>
                  </button>

                  <button
                    onClick={() => {
                      const net = totalGave - totalReceived;
                      const balText = net > 0 ? `Lene Hain: ${formatCurrency(net, currency)}` : net < 0 ? `Dene Hain: ${formatCurrency(Math.abs(net), currency)}` : 'Hisaab Clear Hai (0)';
                      const msg = encodeURIComponent(`*Easy Khata Book - Hisaab Slip*\n👤 *${person.name}*\n💰 *${balText}*\n_Barahe karam hisaab check karein._`);
                      const phone = person.phone ? person.phone.replace(/[^0-9]/g, '') : '';
                      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                    }}
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                    title="WhatsApp par reminder bhejein"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedPersonId(person.id)}
                    className="py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                    title="Poora hisaab dekhein"
                  >
                    Ledger →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Action Button - Easy Khata + Add Customer Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-20">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setEditingPerson(null);
              setIsAddPersonOpen(true);
            }}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-black text-sm sm:text-base transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>+ Naya Customer / Banda Add Karein</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Person Modal */}
      <AddKhataPersonModal
        isOpen={isAddPersonOpen}
        onClose={() => {
          setIsAddPersonOpen(false);
          setEditingPerson(null);
        }}
        editingPerson={editingPerson}
        onSave={(personData, initialBal) => {
          if (editingPerson) {
            onUpdatePerson({ ...editingPerson, ...personData });
          } else {
            onSavePerson(personData, initialBal);
          }
        }}
      />

      {/* Add / Edit Entry Modal */}
      {entryPerson && (
        <AddKhataEntryModal
          isOpen={isAddEntryOpen}
          onClose={() => {
            setIsAddEntryOpen(false);
            setEditingEntry(null);
          }}
          person={entryPerson}
          currency={currency}
          initialType={entryType}
          editingTransaction={editingEntry}
          onSave={onSaveKhataTransaction}
        />
      )}
    </div>
  );
};
