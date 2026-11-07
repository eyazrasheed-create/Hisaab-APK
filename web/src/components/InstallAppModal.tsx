import React, { useState } from 'react';
import { generateQRCodeSVG } from '../utils/qrCode';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Share2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'android_direct' | 'offline_file' | 'apk_package' | 'ios'>('android_direct');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The actual active live URL running this applet
  const liveDevUrl = 'https://ais-dev-fzqhxjepwqynnyq6iwycq6-664329838473.asia-northeast1.run.app';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrSvg = generateQRCodeSVG(liveDevUrl, 160);
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(liveDevUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Mobile Par Install Karein / Download APK
              </h3>
              <p className="text-xs text-slate-500">
                Rozana Hisaab app ko apne mobile me chalane ke aasan tareeqay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center border-b border-slate-200 px-6 pt-3 gap-2 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('android_direct')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'android_direct'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>1. Live Link (Direct Install)</span>
          </button>

          <button
            onClick={() => setActiveTab('offline_file')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'offline_file'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4 text-amber-600" />
            <span>2. Offline App File (No Login)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk_package')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'apk_package'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>3. APK Package (.APK)</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
              activeTab === 'ios'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>iPhone / iOS</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* TAB 1: Android Direct Install (WebAPK) */}
          {activeTab === 'android_direct' && (
            <div className="space-y-4">
              {/* Error Explanation Notice */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>"No webpage found" error kyun aaya tha?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Pehle un-deployed preview link generate ho raha tha jo ab sahi live link se replace kar diya gaya hai.
                  Kyunke ye AI Studio ka development URL hai, <strong>phone ke Chrome me aapka wohi Google account login hona zaroori hai jisse aap AI Studio chala rahe hain</strong> (e.g. <code>eyaz.rasheed@gmail.com</code>).
                </p>
              </div>

              {/* 1-Click Install Button if supported right now in this browser */}
              {isInstallable && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      1-Click Install Button Dastiyaab Hai!
                    </h4>
                    <p className="text-[11px] text-emerald-700">
                      Abhi button dabayein aur app aapke browser/phone me install ho jayegi.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await onInstallPrompt();
                      onClose();
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs shrink-0"
                  >
                    Install App Now
                  </button>
                </div>
              )}

              {/* Direct Correct Live URL */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Sahi Live URL (Phone ke Chrome me ye kholen):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={liveDevUrl}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 select-all font-semibold"
                  />
                  <button
                    onClick={() => handleCopy(liveDevUrl)}
                    className="px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Ye link copy kar ke WhatsApp ya email ke zariye apne mobile par bhejein aur Google Chrome me kholen.
                </p>
              </div>

              {/* QR Code and Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 bg-white border border-slate-200 rounded-xl">
                <div className="sm:col-span-4 flex flex-col items-center justify-center">
                  <div
                    className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 inline-block"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 font-medium">
                    Phone camera se scan karein
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-slate-900">Phone me open karne ke baad:</div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600">
                    <li>Chrome me ye URL open karein.</li>
                    <li>Chrome ke top-right <strong>(⋮) 3 dots</strong> par tap karein.</li>
                    <li><strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> par tap karein.</li>
                    <li>App aapke phone ki screen par icon ke sath install ho jayegi!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Standalone Offline HTML File (Guaranteed to work without Google Login) */}
          {activeTab === 'offline_file' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Guaranteed Solution (Kisi Google Login Ki Zaroorat Nahi)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Humne poori Rozana Hisaab app ko ek single offline file (<code>rozana-hisaab.html</code>) me pack kar diya hai.
                  Aap isay direct download kar ke WhatsApp se phone me bhej kar open kar sakte hain. Ye bina kisi error ya login ke foran khul jati hai!
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Download & Run Instructions:
                </h4>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <span>Neeche diye gaye button par click kar ke <strong>rozana-hisaab.html</strong> download karein.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <span>Ye file WhatsApp ya Bluetooth se apne Android phone me bhej lein.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                    <span>Phone me is file par tap karein aur <strong>Chrome Browser</strong> me open karein.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">4</span>
                    <span>Chrome me <strong>"Add to Home screen"</strong> dabayein — aapki app install ho jayegi!</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/rozana-hisaab-mobile.html"
                    download="rozana-hisaab.html"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download rozana-hisaab.html (Offline Mobile App)</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Generate .APK file / PWABuilder Guide */}
          {activeTab === 'apk_package' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-2">
                <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>PWABuilder Par Confusion? Yeh 3 Aasan Rastay Hain:</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  PWABuilder technical tool hai jo coding aur signing keys mangta hai. Agar aapko samajh nahi aa raha toh pareshan na hon, neeche diye gaye raston me se koi ek chunein:
                </p>
              </div>

              {/* Rasta 1: Direct Android Chrome (Sab Se Behtareen) */}
              <div className="border-2 border-emerald-500/40 bg-emerald-50/70 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Sab Se Aasan: Chrome Se Direct Install (Kisi Tool Ki Zaroorat Nahi)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Mobile Chrome me ye link kholein: <br />
                  <span className="font-mono text-[10px] font-bold text-emerald-900 bg-white/80 px-2 py-0.5 rounded border border-emerald-200 inline-block my-1 break-all">
                    {liveDevUrl}
                  </span>
                  <br />
                  Chrome ke top-right <strong>(⋮) 3 dots</strong> par click karein aur <strong>"Install app"</strong> dabayein. Android phone khud ba khud iski real <strong>WebAPK</strong> phone ke andar install kar deta hai!
                </p>
              </div>

              {/* Rasta 2: Jo Manifest Download Ki Thi, PWABuilder Me Aage Kya Karna Hai */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Agar PWABuilder Hi Use Karna Hai (Manifest Ke Baad Agla Step):</span>
                </div>
                
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700">
                  <li>PWABuilder screen par ooper <strong>"Package for Stores"</strong> ya <strong>"Next"</strong> button dabayein.</li>
                  <li>Wahan <strong>"Android"</strong> option ke neeche <strong>"Generate"</strong> ya <strong>"Package"</strong> par tap karein.</li>
                  <li>Signing Key me <strong>"None"</strong> ya <strong>"Test Key"</strong> select karein.</li>
                  <li>PWABuilder aapko ek <strong>.ZIP file</strong> download kar ke dega, jiske andar <strong>.APK</strong> file hoti hai!</li>
                </ol>

                <div className="pt-1">
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <span>PWABuilder Par Package Karein</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Rasta 3: 1-Click APK Generator (AppsGeyser) */}
              <div className="border border-sky-200 rounded-xl p-3.5 bg-sky-50/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-950">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Direct 1-Click APK Generator (AppsGeyser — No JSON Required)</span>
                </div>
                <p className="text-[11px] text-sky-900 leading-relaxed">
                  Agar aapko sirf ready-made <code>.apk</code> file download karni hai, toh AppsGeyser website par ja kar sirf hamari app ka URL paste karein, wo direct APK file bana deta hai:
                </p>
                <a
                  href="https://appsgeyser.com/create-url-app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  <span>AppsGeyser Se Direct APK Generate Karein</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: iPhone / iOS Guide */}
          {activeTab === 'ios' && (
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-sky-600" />
                <span>iPhone / iPad (Safari) Par Install Karein</span>
              </h4>

              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed pt-1">
                <li>Apne iPhone me <strong>Safari Browser</strong> kholen.</li>
                <li>App ka URL open karein: <span className="font-mono text-[11px] font-semibold text-slate-900">{liveDevUrl}</span></li>
                <li>Neeche Safari toolbar me <strong>Share button (Square with up arrow ⎋)</strong> par tap karein.</li>
                <li>Scroll kar ke <strong>"Add to Home Screen"</strong> par tap karein.</li>
                <li>Top-right par <strong>"Add"</strong> dabayein. App icon aapki home screen par aa jayega!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>100% Offline Compatible & Local Storage</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Band Karein
          </button>
        </div>
      </div>
    </div>
  );
};
