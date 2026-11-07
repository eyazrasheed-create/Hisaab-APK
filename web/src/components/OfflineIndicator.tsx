import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-slate-700">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — Tamam hisaab local phone storage me mehfooz ho raha hai.</span>
    </div>
  );
};
