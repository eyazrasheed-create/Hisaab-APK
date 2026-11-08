/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppSettings, Category, CurrencySymbol, Language, Transaction, TransactionType, KhataPerson, KhataTransaction, UserProfile } from './types';
import {
  calculateAllKhataStats,
  calculateDayLedger,
  calculateMonthlyStats,
  generateSampleData,
  generateSampleKhata,
  loadCategories,
  loadSettings,
  loadTransactions,
  loadKhataPersons,
  loadKhataTransactions,
  saveCategories,
  saveSettings,
  saveTransactions,
  saveKhataPersons,
  saveKhataTransactions,
  loadActiveUser,
  saveActiveUser,
  clearAllData,
} from './utils/storage';
import { getTodayDateString } from './utils/formatters';
import { Header } from './components/Header';
import { DailyLedgerView } from './components/DailyLedgerView';
import { KhataView } from './components/KhataView';
import { MonthlySummaryView } from './components/MonthlySummaryView';
import { AllTransactionsView } from './components/AllTransactionsView';
import { CategoriesBudgetView } from './components/CategoriesBudgetView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { SetBalanceModal } from './components/SetBalanceModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InstallAppModal } from './components/InstallAppModal';
import { AuthScreen } from './components/AuthScreen';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useMobileBackHandler } from './hooks/useMobileBackGesture';

export default function App() {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(loadActiveUser);
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [categories, setCategoriesState] = useState<Category[]>(loadCategories);
  const [transactions, setTransactionsState] = useState<Transaction[]>(loadTransactions);
  const [khataPersons, setKhataPersonsState] = useState<KhataPerson[]>(loadKhataPersons);
  const [khataTransactions, setKhataTransactionsState] = useState<KhataTransaction[]>(loadKhataTransactions);

  const [currentTab, setCurrentTab] = useState<'daily' | 'khata' | 'monthly' | 'transactions' | 'budgets'>('khata');
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = getTodayDateString();
    return today.substring(0, 7);
  });

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<TransactionType>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSetBalanceOpen, setIsSetBalanceOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Android edge swipe back and hardware back button navigation
  useMobileBackHandler(isAddModalOpen, () => { setIsAddModalOpen(false); setEditingTransaction(null); }, 'add-expense-modal');
  useMobileBackHandler(isSetBalanceOpen, () => setIsSetBalanceOpen(false), 'set-balance-modal');
  useMobileBackHandler(isBackupOpen, () => setIsBackupOpen(false), 'backup-modal');
  useMobileBackHandler(isInstallModalOpen, () => setIsInstallModalOpen(false), 'install-modal');
  useMobileBackHandler(currentTab !== 'khata', () => setCurrentTab('khata'), 'tab-khata');

  // PWA Install hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Persistence helpers
  const updateSettings = (newSettings: AppSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const updateCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories);
    saveCategories(newCategories);
  };

  const updateTransactions = (newTransactions: Transaction[]) => {
    setTransactionsState(newTransactions);
    saveTransactions(newTransactions);
  };

  const updateKhataPersons = (newPersons: KhataPerson[]) => {
    setKhataPersonsState(newPersons);
    saveKhataPersons(newPersons);
  };

  const updateKhataTransactions = (newTxs: KhataTransaction[]) => {
    setKhataTransactionsState(newTxs);
    saveKhataTransactions(newTxs);
  };

  // Calculations
  const dayLedger = useMemo(() => {
    return calculateDayLedger(currentDate, transactions, settings);
  }, [currentDate, transactions, settings]);

  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(selectedMonth, transactions, categories);
  }, [selectedMonth, transactions, categories]);

  const khataStats = useMemo(() => {
    return calculateAllKhataStats(khataPersons, khataTransactions);
  }, [khataPersons, khataTransactions]);

  // Handlers
  const handleOpenAddModal = (type: 'expense' | 'income') => {
    setEditingTransaction(null);
    setAddModalType(type);
    setIsAddModalOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setAddModalType(tx.type);
    setIsAddModalOpen(true);
  };

  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Update existing
      const updated = transactions.map((t) =>
        t.id === existingId ? { ...t, ...txData } : t
      );
      updateTransactions(updated);
    } else {
      // Create new
      const newTx: Transaction = {
        ...txData,
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      updateTransactions([newTx, ...transactions]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    updateTransactions(updated);
  };

  const handleSaveInitialBalance = (amount: number, date: string) => {
    updateSettings({
      ...settings,
      initialBalance: amount,
      initialBalanceDate: date,
    });
  };

  const handleSelectDay = (date: string) => {
    setCurrentDate(date);
    setCurrentTab('daily');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetSampleData = () => {
    const samples = generateSampleData();
    updateTransactions(samples);
    const khataSamples = generateSampleKhata();
    updateKhataPersons(khataSamples.persons);
    updateKhataTransactions(khataSamples.transactions);
  };

  const handleClearAllData = () => {
    updateTransactions([]);
    updateKhataPersons([]);
    updateKhataTransactions([]);
  };

  const handleImportData = (
    importedTxs: Transaction[],
    importedCats?: Category[],
    importedSettings?: AppSettings,
    importedKhataPersons?: KhataPerson[],
    importedKhataTxs?: KhataTransaction[]
  ) => {
    updateTransactions(importedTxs);
    if (importedCats) updateCategories(importedCats);
    if (importedSettings) updateSettings(importedSettings);
    if (importedKhataPersons) updateKhataPersons(importedKhataPersons);
    if (importedKhataTxs) updateKhataTransactions(importedKhataTxs);
  };

  // Khata Handlers
  const handleSaveKhataPerson = (
    personData: Omit<KhataPerson, 'id' | 'createdAt'>,
    initialBalance?: { amount: number; type: 'gave' | 'received' }
  ) => {
    const personId = `person_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPerson: KhataPerson = {
      ...personData,
      id: personId,
      createdAt: Date.now(),
    };

    updateKhataPersons([...khataPersons, newPerson]);

    if (initialBalance && initialBalance.amount > 0) {
      const initialTx: KhataTransaction = {
        id: `ktx_${Date.now()}`,
        personId: personId,
        date: getTodayDateString(),
        time: '00:00',
        amount: initialBalance.amount,
        type: initialBalance.type,
        note: 'Pehle ka purana baqi hisaab',
        paymentMethod: 'cash',
        syncWithCash: false,
        createdAt: Date.now(),
      };
      updateKhataTransactions([initialTx, ...khataTransactions]);
    }
  };

  const handleUpdateKhataPerson = (updated: KhataPerson) => {
    const newList = khataPersons.map((p) => (p.id === updated.id ? updated : p));
    updateKhataPersons(newList);
  };

  const handleDeleteKhataPerson = (personId: string) => {
    updateKhataPersons(khataPersons.filter((p) => p.id !== personId));
    updateKhataTransactions(khataTransactions.filter((tx) => tx.personId !== personId));
  };

  const handleSaveKhataTransaction = (
    txData: Omit<KhataTransaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      const updated = khataTransactions.map((t) =>
        t.id === existingId ? { ...t, ...txData } : t
      );
      updateKhataTransactions(updated);
    } else {
      const newKtx: KhataTransaction = {
        ...txData,
        id: `ktx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now(),
      };
      updateKhataTransactions([newKtx, ...khataTransactions]);

      // Sync with Daily Cash Ledger if requested
      if (txData.syncWithCash) {
        const person = khataPersons.find((p) => p.id === txData.personId);
        const personName = person ? person.name : 'Khata';

        if (txData.type === 'gave') {
          // Spent cash on him / gave him money -> Daily cash expense
          const dailyExpense: Transaction = {
            id: `tx_k_exp_${Date.now()}`,
            date: txData.date,
            time: txData.time || '12:00',
            type: 'expense',
            amount: txData.amount,
            categoryId: 'other',
            paymentMethod: txData.paymentMethod || 'cash',
            note: `Khata: ${personName} ko diye (${txData.note})`,
            createdAt: Date.now(),
          };
          updateTransactions([dailyExpense, ...transactions]);
        } else if (txData.type === 'received') {
          // Received cash from him / he returned money -> Daily cash income
          const dailyIncome: Transaction = {
            id: `tx_k_inc_${Date.now()}`,
            date: txData.date,
            time: txData.time || '12:00',
            type: 'income',
            amount: txData.amount,
            categoryId: 'other',
            paymentMethod: txData.paymentMethod || 'cash',
            note: `Khata: ${personName} ne wapis diye (${txData.note})`,
            createdAt: Date.now(),
          };
          updateTransactions([dailyIncome, ...transactions]);
        }
      }
    }
  };

  const handleDeleteKhataTransaction = (txId: string) => {
    updateKhataTransactions(khataTransactions.filter((t) => t.id !== txId));
  };

  const handleLogout = () => {
    saveActiveUser(null);
    setActiveUser(null);
  };

  const handleResetAllToZero = () => {
    clearAllData(true);
    updateTransactions([]);
    updateKhataPersons([]);
    updateKhataTransactions([]);
    setSettingsState(loadSettings());
  };

  if (!activeUser) {
    return <AuthScreen onLogin={(user) => setActiveUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenSetBalance={() => setIsSetBalanceOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        language={settings.language}
        setLanguage={(lang: Language) => updateSettings({ ...settings, language: lang })}
        currency={settings.currency}
        setCurrency={(curr: CurrencySymbol) => updateSettings({ ...settings, currency: curr })}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        activeUser={activeUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 overflow-x-hidden">
        {currentTab === 'daily' && (
          <DailyLedgerView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            dayLedger={dayLedger}
            categories={categories}
            settings={settings}
            onOpenAddModal={handleOpenAddModal}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenSetBalance={() => setIsSetBalanceOpen(true)}
            khataPersons={khataPersons}
            khataTransactions={khataTransactions}
            khataSummary={{
              totalReceivable: khataStats.totalReceivable,
              totalPayable: khataStats.totalPayable,
              activeCount: khataStats.activeCount,
            }}
            onNavigateToKhata={() => setCurrentTab('khata')}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        )}

        {currentTab === 'khata' && (
          <KhataView
            persons={khataPersons}
            khataTransactions={khataTransactions}
            currency={settings.currency}
            onSavePerson={handleSaveKhataPerson}
            onUpdatePerson={handleUpdateKhataPerson}
            onDeletePerson={handleDeleteKhataPerson}
            onSaveKhataTransaction={handleSaveKhataTransaction}
            onDeleteKhataTransaction={handleDeleteKhataTransaction}
          />
        )}

        {currentTab === 'monthly' && (
          <MonthlySummaryView
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            monthlyStats={monthlyStats}
            categories={categories}
            settings={settings}
            onSelectDay={handleSelectDay}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {currentTab === 'transactions' && (
          <AllTransactionsView
            transactions={transactions}
            categories={categories}
            settings={settings}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onExportCSV={() => setIsBackupOpen(true)}
            onSelectDay={handleSelectDay}
          />
        )}

        {currentTab === 'budgets' && (
          <CategoriesBudgetView
            categories={categories}
            setCategories={updateCategories}
            settings={settings}
            setSettings={updateSettings}
            onOpenBackup={() => setIsBackupOpen(true)}
            onOpenSetBalance={() => setIsSetBalanceOpen(true)}
            activeUser={activeUser}
            onLogout={handleLogout}
            onClearAllData={handleResetAllToZero}
          />
        )}
      </main>

      {/* Clean Unobtrusive Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Easy Khata Book</span>
            <span aria-hidden="true">·</span>
            <span>Digital Udhaar & Rozana Cash Ledger</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Export CSV / JSON
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsSetBalanceOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Adjust Cash Baseline
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        isInstallable={isInstallable}
        onInstallPrompt={install}
        isIOS={isIOS}
        isInstalled={isInstalled}
      />

      <OfflineIndicator />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        currency={settings.currency}
        language={settings.language}
        defaultDate={currentDate}
        initialType={addModalType}
        editingTransaction={editingTransaction}
      />

      <SetBalanceModal
        isOpen={isSetBalanceOpen}
        onClose={() => setIsSetBalanceOpen(false)}
        onSave={handleSaveInitialBalance}
        currentInitialBalance={settings.initialBalance}
        currentInitialDate={settings.initialBalanceDate}
        currency={settings.currency}
        language={settings.language}
      />

      <BackupRestoreModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        transactions={transactions}
        categories={categories}
        settings={settings}
        khataPersons={khataPersons}
        khataTransactions={khataTransactions}
        onImport={handleImportData}
        onResetSample={handleResetSampleData}
        onClearAll={handleClearAllData}
      />
    </div>
  );
}
