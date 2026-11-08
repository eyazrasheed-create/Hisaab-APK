import React, { useState } from 'react';
import { X, Smartphone, Download, Check, Sparkles, Globe, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  onInstallPrompt: () => Promise<boolean>;
  isIOS: boolean;
  isInstalled: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  onInstallPrompt,
  isIOS,
  isInstalled,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'android_direct' | 'apk_guide' | 'offline_file'>('android_direct');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <img
              src="/app-icon.png"
              alt="Easy Khata Book"
              className="w-10 h-10 rounded-xl shadow-xs object-cover"
            />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Mobile Par Install Karein / APK
              </h3>
              <p className="text-xs text-slate-300">
                Easy Khata Book ko phone par application ki tarah chalayein
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
          <button
            onClick={() => setActiveTab('android_direct')}
            className={`flex-1 py-3 px-2 border-b-2 transition-colors ${
              activeTab === 'android_direct'
                ? 'border-emerald-600 text-emerald-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Chrome Direct Install
          </button>
          <button
            onClick={() => setActiveTab('apk_guide')}
            className={`flex-1 py-3 px-2 border-b-2 transition-colors ${
              activeTab === 'apk_guide'
                ? 'border-emerald-600 text-emerald-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. APK File Guide
          </button>
          <button
            onClick={() => setActiveTab('offline_file')}
            className={`flex-1 py-3 px-2 border-b-2 transition-colors ${
              activeTab === 'offline_file'
                ? 'border-emerald-600 text-emerald-800 bg-white font-extrabold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Offline Single File (.html)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          {activeTab === 'android_direct' && (
            <div className="space-y-4">
              {isInstallable && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                  <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Direct 1-Click Install Button Dastiyaab Hai!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Aapka browser direct app install ko support karta hai. Button dabayein aur app screen par install ho jayegi:
                  </p>
                  <button
                    onClick={async () => {
                      const res = await onInstallPrompt();
                      if (res) onClose();
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App on Mobile Now</span>
                  </button>
                </div>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900">Android Chrome Se Install Karne Ka Aasan Tareeqa:</div>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                  <li>Phone ke Chrome browser me ye link kholein.</li>
                  <li>Chrome ke upar daayen (top-right) bane <strong>(⋮) 3 dots menu</strong> par tap karein.</li>
                  <li>Menu me se <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> chunein.</li>
                  <li>Aapke mobile par Easy Khata Book ka icon install ho jayega!</li>
                </ol>
              </div>

              {/* Share/Copy Link */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                <div className="truncate font-mono text-[11px] text-slate-600">
                  {currentUrl}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] shrink-0"
                >
                  {copiedLink ? 'Copied ✓' : 'Copy Link'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'apk_guide' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-950">
                <div className="font-bold text-amber-900">PWABuilder / APK Builders Ka Tareeqa:</div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  Agar aap <code>.apk</code> package download karna chahte hain, toh PWABuilder ya AppsGeyser par ja kar is app ka link paste karein:
                </p>
                <div className="p-2 bg-white rounded border border-amber-300 font-mono text-[11px] text-slate-800 break-all select-all">
                  {currentUrl}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900">App Icon For APK:</div>
                <p className="text-[11px] text-slate-600">
                  Agar APK builder aapse icon maangta hai, toh hamari app ka naya <strong>512x512 Emerald & Gold Icon</strong> aap Budget tab me ja kar 1-click me download kar sakte hain!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'offline_file' && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                <div className="font-bold text-emerald-900">Pure Offline Package (.html):</div>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Ye ek single file hai jisme poori app shamil hai. Ise apne phone ya computer me download karein, aur internet ke baghair direct double click karke chalayein!
                </p>
                <a
                  href="/rozana-hisaab-mobile.html"
                  download="rozana-hisaab-mobile.html"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors mt-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download rozana-hisaab-mobile.html</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-colors"
          >
            Band Karein (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
