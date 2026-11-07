import React, { useState } from 'react';
import { AppSettings, Category, CurrencySymbol } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { Plus, Tag, Target, Settings, Database, Edit2, Check } from 'lucide-react';

interface CategoriesBudgetViewProps {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onOpenBackup: () => void;
  onOpenSetBalance: () => void;
}

export const CategoriesBudgetView: React.FC<CategoriesBudgetViewProps> = ({
  categories,
  setCategories,
  settings,
  setSettings,
  onOpenBackup,
  onOpenSetBalance,
}) => {
  const { language, currency, dailyExpenseBudget = 2500 } = settings;
  const [editingBudgetCatId, setEditingBudgetCatId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  // Add custom category state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366f1');
  const [newCatBudget, setNewCatBudget] = useState('');

  const handleSaveBudget = (catId: string) => {
    const parsed = parseFloat(tempBudget);
    const updated = categories.map((c) =>
      c.id === catId ? { ...c, budgetLimit: isNaN(parsed) || parsed <= 0 ? undefined : parsed } : c
    );
    setCategories(updated);
    setEditingBudgetCatId(null);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `custom_${Date.now()}`,
      name: newCatName.trim(),
      nameRoman: newCatName.trim(),
      nameUrdu: newCatName.trim(),
      color: newCatColor,
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-800',
      icon: 'Tag',
      isCustom: true,
      budgetLimit: parseFloat(newCatBudget) || undefined,
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatBudget('');
    setIsAddingCategory(false);
  };

  return (
    <div className="space-y-6">
      {/* Category Budgets Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Categories & Mahana Budget Limits
            </h3>
            <p className="text-xs text-slate-500">
              Har category ke liye apna mahana budget set karein taake kharche par qabu rahe
            </p>
          </div>

          <button
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nayi Category Banayein</span>
          </button>
        </div>

        {/* Add custom category form */}
        {isAddingCategory && (
          <form
            onSubmit={handleAddCategory}
            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-800">Nayi Category Ki Detail</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category Ka Naam (e.g. Gym, Pet Food)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                required
              />
              <input
                type="number"
                placeholder={`Monthly Budget (${currency})`}
                value={newCatBudget}
                onChange={(e) => setNewCatBudget(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0"
                />
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {categories.map((cat) => {
            const displayName =
              language === 'urdu'
                ? cat.nameUrdu
                : language === 'roman_urdu'
                ? cat.nameRoman
                : cat.name;

            const isEditing = editingBudgetCatId === cat.id;

            return (
              <div
                key={cat.id}
                className="p-3.5 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex items-center justify-between gap-3 bg-white"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {cat.budgetLimit
                        ? `Budget: ${formatCurrency(cat.budgetLimit, currency)}/mah`
                        : 'Koi budget set nahi'}
                    </div>
                  </div>
                </div>

                {/* Edit Budget Limit */}
                <div className="shrink-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        autoFocus
                        placeholder="Limit"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-slate-300 rounded font-mono"
                      />
                      <button
                        onClick={() => handleSaveBudget(cat.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingBudgetCatId(cat.id);
                        setTempBudget(String(cat.budgetLimit || ''));
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                      title="Set / Edit monthly budget"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Daily Limit & Overall Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Expense Target */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Rozana Kharch Ka Target (Daily Spending Goal)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Aap rozana ziyada se ziyada kitna kharch karna chahte hain
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                {currency}
              </span>
              <input
                type="number"
                value={dailyExpenseBudget}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setSettings({ ...settings, dailyExpenseBudget: val });
                }}
                className="w-full pl-10 pr-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
            <span className="text-xs text-slate-400">/ din</span>
          </div>
        </div>

        {/* Quick Settings & Data Backup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Data Backup & Storage
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Apna hisaab kitaab mehfooz rakhein ya excel file download karein
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenBackup}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              Backup & Restore Kholen
            </button>
            <button
              onClick={onOpenSetBalance}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              Opening Balance Adjust
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
