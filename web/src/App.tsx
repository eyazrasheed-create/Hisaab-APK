/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppSettings, Category, CurrencySymbol, Language, Transaction, TransactionType } from './types';
import {
  calculateDayLedger,
  calculateMonthlyStats,
  generateSampleData,
  loadCategories,
  loadSettings,
  loadTransactions,
  saveCategories,
  saveSettings,
  saveTransactions,
} from './utils/storage';
import { getTodayDateString } from './utils/formatters';
import { Header } from './components/Header';
import { DailyLedgerView } from './components/DailyLedgerView';
import { MonthlySummaryView } from './components/MonthlySummaryView';
import { AllTransactionsView } from './components/AllTransactionsView';
import { CategoriesBudgetView } from './components/CategoriesBudgetView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { SetBalanceModal } from './components/SetBalanceModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';
import { InstallAppModal } from './components/InstallAppModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [categories, setCategoriesState] = useState<Category[]>(loadCategories);
  const [transactions, setTransactionsState] = useState<Transaction[]>(loadTransactions);

  const [currentTab, setCurrentTab] = useState<'daily' | 'monthly' | 'transactions' | 'budgets'>('daily');
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

  // Calculations
  const dayLedger = useMemo(() => {
    return calculateDayLedger(currentDate, transactions, settings);
  }, [currentDate, transactions, settings]);

  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(selectedMonth, transactions, categories);
  }, [selectedMonth, transactions, categories]);

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
  };

  const handleClearAllData = () => {
    updateTransactions([]);
  };

  const handleImportData = (
    importedTxs: Transaction[],
    importedCats?: Category[],
    importedSettings?: AppSettings
  ) => {
    updateTransactions(importedTxs);
    if (importedCats) updateCategories(importedCats);
    if (importedSettings) updateSettings(importedSettings);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
        onOpenSetBalance={() => setIsSetBalanceOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        language={settings.language}
        setLanguage={(lang: Language) => updateSettings({ ...settings, language: lang })}
        currency={settings.currency}
        setCurrency={(curr: CurrencySymbol) => updateSettings({ ...settings, currency: curr })}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
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
          />
        )}
      </main>

      {/* Clean Unobtrusive Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Rozana Hisaab</span>
            <span aria-hidden="true">·</span>
            <span>Aap ka zati cash aur kharcha ledger</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              Install on Mobile / APK
            </button>
            <span aria-hidden="true">·</span>
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
        onImport={handleImportData}
        onResetSample={handleResetSampleData}
        onClearAll={handleClearAllData}
      />
    </div>
  );
}
