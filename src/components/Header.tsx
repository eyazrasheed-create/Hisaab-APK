import React from 'react';
import { CurrencySymbol, Language, UserProfile } from '../types';
import { t } from '../utils/translations';
import { Plus, Wallet, Calendar, PieChart, ListFilter, Tag, Globe, Settings as SettingsIcon, Smartphone, Users, User, LogOut } from 'lucide-react';

interface HeaderProps {
  currentTab: 'daily' | 'khata' | 'monthly' | 'transactions' | 'budgets';
  setCurrentTab: (tab: 'daily' | 'khata' | 'monthly' | 'transactions' | 'budgets') => void;
  onOpenAddModal: (type: 'expense' | 'income') => void;
  onOpenSetBalance: () => void;
  onOpenBackup: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: CurrencySymbol;
  setCurrency: (curr: CurrencySymbol) => void;
  onOpenInstallModal?: () => void;
  activeUser?: UserProfile | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAddModal,
  onOpenSetBalance,
  onOpenBackup,
  language,
  setLanguage,
  currency,
  setCurrency,
  onOpenInstallModal,
  activeUser,
  onLogout,
}) => {
  const isAndroidApk = typeof window !== 'undefined' && window.location.hostname === 'appassets.androidplatform.net';
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full max-w-full overflow-hidden pt-7 sm:pt-0">
      {/* Main Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 h-14 sm:h-16 w-full max-w-full">
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <img
              src="/app-icon.png"
              alt="Easy Khata Book"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs object-cover shrink-0"
            />
            <div>
              <div className="text-xs sm:text-base font-black tracking-tight text-slate-900 whitespace-nowrap flex items-center gap-1.5">
                <span>Easy Khata Book</span>
                <span className="text-[9px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                  Bazaar
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block whitespace-nowrap">
                Digital Udhaar & Cash Book
              </div>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links (Easy Khata order: Khata first) */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setCurrentTab('khata')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'khata'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Khata (Logon Ka Hisaab)</span>
            </button>

            <button
              onClick={() => setCurrentTab('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'daily'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Cash Book (Rozana Rokar)</span>
            </button>

            <button
              onClick={() => setCurrentTab('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'monthly'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Reports (Khulasa)</span>
            </button>

            <button
              onClick={() => setCurrentTab('transactions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'transactions'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Entries</span>
            </button>

            <button
              onClick={() => setCurrentTab('budgets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                currentTab === 'budgets'
                  ? 'bg-slate-100 text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Zone 3: Primary CTA Button + Quick utilities with horizontal touch drag */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar touch-pan-x flex-nowrap min-w-0 py-1 pl-1 pr-1">
            {/* Language dropdown / toggle */}
            <div className="relative group shrink-0">
              <button
                className="flex items-center gap-1 px-2 py-1.5 text-[11px] sm:text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shrink-0"
                title="Change language / Zaban tabdeel karein"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">
                  {language === 'roman_urdu' ? 'Roman' : language === 'urdu' ? 'اردو' : 'Eng'}
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
              className="px-1.5 py-1.5 text-[11px] sm:text-xs font-mono font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer shrink-0"
              title="Currency"
            >
              <option value="Rs">Rs</option>
              <option value="PKR">PKR</option>
              <option value="$">$</option>
              <option value="AED">AED</option>
              <option value="SAR">SAR</option>
              <option value="₹">₹</option>
            </select>

            {/* Install / APK button (Hidden on Android APK appassets.androidplatform.net) */}
            {!isAndroidApk && onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Install app on mobile or download APK"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="hidden sm:inline">Install / APK</span>
                <span className="sm:hidden">APK</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => onOpenAddModal('expense')}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
              title={t('addExpense', language)}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{t('addExpense', language)}</span>
              <span className="sm:hidden">Kharcha</span>
            </button>

            {/* Active User Avatar / Switch */}
            {activeUser && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-900 transition-colors shrink-0"
                title={`${activeUser.name} (${activeUser.identifier}) - Click to logout / switch account`}
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {activeUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-bold max-w-[70px] sm:max-w-[110px] truncate hidden sm:inline">
                  {activeUser.name}
                </span>
                <LogOut className="w-3 h-3 text-emerald-700 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar: Easy Khata layout with Khata First */}
        <div className="grid grid-cols-5 md:hidden py-1.5 border-t border-slate-100 text-[11px] text-center w-full">
          <button
            onClick={() => setCurrentTab('khata')}
            className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 transition-colors ${
              currentTab === 'khata'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="truncate max-w-full font-black">Khata</span>
          </button>

          <button
            onClick={() => setCurrentTab('daily')}
            className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 transition-colors ${
              currentTab === 'daily' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="truncate max-w-full">Cash Book</span>
          </button>

          <button
            onClick={() => setCurrentTab('monthly')}
            className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 transition-colors ${
              currentTab === 'monthly' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span className="truncate max-w-full">Reports</span>
          </button>

          <button
            onClick={() => setCurrentTab('transactions')}
            className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 transition-colors ${
              currentTab === 'transactions' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span className="truncate max-w-full">Entries</span>
          </button>

          <button
            onClick={() => setCurrentTab('budgets')}
            className={`py-1.5 px-1 rounded-lg font-bold flex flex-col items-center justify-center gap-0.5 transition-colors ${
              currentTab === 'budgets' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span className="truncate max-w-full">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
