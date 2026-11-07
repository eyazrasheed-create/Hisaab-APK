import React from 'react';
import { CurrencySymbol, Language } from '../types';
import { t } from '../utils/translations';
import { Plus, Wallet, Calendar, PieChart, ListFilter, Tag, Globe, Settings as SettingsIcon, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentTab: 'daily' | 'monthly' | 'transactions' | 'budgets';
  setCurrentTab: (tab: 'daily' | 'monthly' | 'transactions' | 'budgets') => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onOpenSetBalance: () => void;
  onOpenBackup: () => void;
  onOpenInstallModal: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: CurrencySymbol;
  setCurrency: (curr: CurrencySymbol) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddModal,
  onOpenSetBalance,
  onOpenBackup,
  onOpenInstallModal,
  language,
  setLanguage,
  currency,
  setCurrency,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs font-bold text-base">
              ₹
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Rozana Hisaab
              </div>
              <div className="text-[11px] text-slate-400 font-medium hidden sm:block whitespace-nowrap">
                Daily Cash & Kharcha Tracker
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('daily')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'daily'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('tabDaily', language)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('monthly')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'monthly'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>{t('tabMonthly', language)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('transactions')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'transactions'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>{t('tabTransactions', language)}</span>
            </button>

            <button
              onClick={() => setCurrentTab('budgets')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'budgets'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>{t('tabBudgets', language)}</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA Button + Quick utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Install / APK button (APK ke andar nahi dikhta) */}
            {window.location.hostname !== 'appassets.androidplatform.net' && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
              title="Install on Mobile / Download APK"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Install / APK</span>
            </button>
            )}

            {/* Language dropdown / toggle */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                title="Change language / Zaban tabdeel karein"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {language === 'roman_urdu' ? 'Roman Urdu' : language === 'urdu' ? 'اردو' : 'English'}
                </span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-50">
                <button
                  onClick={() => setLanguage('roman_urdu')}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    language === 'roman_urdu' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Roman Urdu
                </button>
                <button
                  onClick={() => setLanguage('english')}
                  className={`w-full text-left px-3 py-1.5 text-xs ${
                    language === 'english' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('urdu')}
                  className={`w-full text-left px-3 py-1.5 text-xs font-arabic ${
                    language === 'urdu' ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  اردو (Urdu)
                </button>
              </div>
            </div>

            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencySymbol)}
              className="px-2 py-1.5 text-xs font-mono font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
              title="Currency"
            >
              <option value="Rs">Rs (PKR)</option>
              <option value="PKR">PKR</option>
              <option value="$">$ (USD)</option>
              <option value="AED">AED (Dirham)</option>
              <option value="SAR">SAR (Riyal)</option>
              <option value="₹">₹ (INR)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
            </select>

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenAddModal('expense')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addExpense', language)}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setCurrentTab('daily')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md font-medium ${
              currentTab === 'daily' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('tabDaily', language)}</span>
          </button>
          <button
            onClick={() => setCurrentTab('monthly')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md font-medium ${
              currentTab === 'monthly' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>{t('tabMonthly', language)}</span>
          </button>
          <button
            onClick={() => setCurrentTab('transactions')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md font-medium ${
              currentTab === 'transactions' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Entries</span>
          </button>
          <button
            onClick={() => setCurrentTab('budgets')}
            className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md font-medium ${
              currentTab === 'budgets' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
        </div>
      </div>
    </header>
  );
};
