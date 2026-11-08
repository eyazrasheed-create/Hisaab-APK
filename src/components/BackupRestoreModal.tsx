import React, { useRef } from 'react';
import { AppSettings, Category, Transaction, KhataPerson, KhataTransaction } from '../types';
import { getTodayDateString } from '../utils/formatters';
import { Download, Upload, RefreshCw, Trash2, X, FileSpreadsheet, FileJson } from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  categories: Category[];
  settings: AppSettings;
  khataPersons?: KhataPerson[];
  khataTransactions?: KhataTransaction[];
  onImport: (
    transactions: Transaction[],
    categories?: Category[],
    settings?: AppSettings,
    khataPersons?: KhataPerson[],
    khataTransactions?: KhataTransaction[]
  ) => void;
  onResetSample: () => void;
  onClearAll: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  transactions,
  categories,
  settings,
  khataPersons,
  khataTransactions,
  onImport,
  onResetSample,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export as CSV
  const handleExportCSV = () => {
    const categoryMap = new Map(categories.map((c) => [c.id, c.nameRoman || c.name]));
    const headers = ['Date', 'Time', 'Type', 'Amount', 'Category', 'PaymentMethod', 'Note'];
    const rows = transactions.map((t) => [
      t.date,
      t.time,
      t.type,
      t.amount,
      `"${categoryMap.get(t.categoryId) || t.categoryId}"`,
      t.paymentMethod,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rozana_hisaab_${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as JSON
  const handleExportJSON = () => {
    const payload = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      settings,
      categories,
      transactions,
      khataPersons: khataPersons || [],
      khataTransactions: khataTransactions || [],
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rozana_hisaab_backup_${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.transactions && Array.isArray(parsed.transactions)) {
          onImport(
            parsed.transactions,
            parsed.categories,
            parsed.settings,
            parsed.khataPersons,
            parsed.khataTransactions
          );
          alert('Data kamiyabi se import ho gaya!');
          onClose();
        } else if (Array.isArray(parsed)) {
          onImport(parsed);
          alert('Transactions kamiyabi se import ho gaye!');
          onClose();
        } else {
          alert('File format sahi nahi hai.');
        }
      } catch (err) {
        alert('File read karne me masla hua. Barahe karam valid JSON backup file select karein.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900">Data Backup & Restore</h3>
            <p className="text-xs text-slate-500">Apna hisaab kitaab save karein ya naye device par muntaqil karein</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Export Options */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Export / Download Data
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors text-left"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">Excel / CSV File</div>
                  <div className="text-[10px] text-slate-400 font-normal">Spreadsheet me kholne ke liye</div>
                </div>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors text-left"
              >
                <FileJson className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <div className="font-bold">Full JSON Backup</div>
                  <div className="text-[10px] text-slate-400 font-normal">Tamam settings & records</div>
                </div>
              </button>
            </div>
          </div>

          {/* Import Option */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Import / Restore Backup
            </h4>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Backup JSON File Select Karein</span>
            </button>
          </div>

          {/* Demo Data & Reset */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Sample Data & Reset
            </h4>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (confirm('Sample demo transactions dubara load karein?')) {
                    onResetSample();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load Sample Demo Data</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Kya aap waqai tamam data delete karna chahte hain? Ye wapas nahi aayega.')) {
                    onClearAll();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
