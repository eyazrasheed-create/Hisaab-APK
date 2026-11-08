import React, { useState } from 'react';
import { Smartphone, Download, Upload, Check, Sparkles, Image, RefreshCw } from 'lucide-react';

interface IconTheme {
  id: string;
  name: string;
  tag: string;
  primaryColor: string;
  accentColor: string;
  bgGrad: string;
  symbol: string;
  description: string;
  svgDataUri: string;
}

export const AppIconManager: React.FC = () => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('emerald_gold');
  const [customIconDataUri, setCustomIconDataUri] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Ready-made iconic themes for Pakistani Cash Ledger / Rozana Hisaab
  const themes: IconTheme[] = [
    {
      id: 'emerald_gold',
      name: 'Royal Emerald & Gold',
      tag: 'Recommended (Aapka Naya Icon)',
      primaryColor: '#047857',
      accentColor: '#f59e0b',
      bgGrad: 'from-emerald-900 via-emerald-800 to-slate-900',
      symbol: 'Rs',
      description: 'Pakistani deep emerald green leather ledger with gold Rs coin.',
      svgDataUri: '/icon.svg',
    },
    {
      id: 'classic_navy',
      name: 'Sapphire Navy & Gold',
      tag: 'Corporate & Clean',
      primaryColor: '#1e3a8a',
      accentColor: '#fbbf24',
      bgGrad: 'from-blue-950 via-slate-900 to-slate-950',
      symbol: '₨',
      description: 'Modern banking sapphire dark blue with golden rupee coin.',
      svgDataUri: '/icon.svg',
    },
    {
      id: 'red_bahi_khata',
      name: 'Lal Bahi Khata (Traditional)',
      tag: 'Pakistani Dukan Style',
      primaryColor: '#991b1b',
      accentColor: '#facc15',
      bgGrad: 'from-rose-950 via-red-900 to-slate-950',
      symbol: 'کتاب',
      description: 'Pakistani traditional red cloth bahi khata with gold calligraphy.',
      svgDataUri: '/icon.svg',
    },
    {
      id: 'modern_dark',
      name: 'Onyx Black & Neon Cash',
      tag: 'Modern Minimalist',
      primaryColor: '#0f172a',
      accentColor: '#10b981',
      bgGrad: 'from-slate-950 via-slate-900 to-black',
      symbol: 'Rs',
      description: 'Ultra-modern dark aesthetic with neon mint cash arrows.',
      svgDataUri: '/icon.svg',
    },
  ];

  // Handle user uploading custom icon from their phone or computer
  const handleUploadCustomIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setCustomIconDataUri(dataUri);
      setSelectedThemeId('custom');
    };
    reader.readAsDataURL(file);
  };

  // Download high-resolution PNG icon
  const handleDownloadIcon = (format: 'png' | 'svg') => {
    if (format === 'svg') {
      const link = document.createElement('a');
      link.href = '/icon.svg';
      link.download = 'rozana-hisaab-icon.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCopiedStatus('SVG Icon Download Ho Gaya!');
      setTimeout(() => setCopiedStatus(null), 3000);
      return;
    }

    if (customIconDataUri && selectedThemeId === 'custom') {
      const link = document.createElement('a');
      link.href = customIconDataUri;
      link.download = 'app-icon-custom-512x512.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCopiedStatus('Custom Icon Download Ho Gaya!');
      setTimeout(() => setCopiedStatus(null), 3000);
      return;
    }

    // Default download generated 512x512 PNG
    const link = document.createElement('a');
    link.href = '/pwa-512x512.png';
    link.download = 'rozana-hisaab-icon-512x512.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCopiedStatus('512x512 PNG Icon Download Ho Gaya!');
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Smartphone className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                App Icon & APK Branding (Mobile Icon)
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                New
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Apni APK app ka mobile icon yahan se pasand karein ya apni picture/logo upload karein
            </p>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadIcon('png')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs"
            title="Download high-resolution 512x512 icon for PWABuilder"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>Download 512px PNG (For APK)</span>
          </button>
          <button
            onClick={() => handleDownloadIcon('svg')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Download SVG vector"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG</span>
          </button>
        </div>
      </div>

      {copiedStatus && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{copiedStatus}</span>
        </div>
      )}

      {/* Main Preview and Selection Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Left: Mobile App Icon Mockup Preview */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-emerald-950/40 via-transparent to-transparent pointer-events-none" />

          <div className="relative mb-3">
            {/* The Actual Icon Preview Container */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-200 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center">
                {customIconDataUri && selectedThemeId === 'custom' ? (
                  <img
                    src={customIconDataUri}
                    alt="Custom App Icon"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/app-icon.png"
                    alt="Easy Khata Book Icon"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center font-black text-xs shadow-md">
              ✓
            </div>
          </div>

          <div className="text-sm font-extrabold text-white tracking-tight">Easy Khata Book</div>
          <div className="text-[11px] text-emerald-300 font-mono mt-0.5">Mobile Home Screen Icon</div>
          <p className="text-[10px] text-slate-400 mt-2 max-w-[200px]">
            Jab aap mobile me app install karenge ya APK banayenge toh ye icon nazar aayega.
          </p>
        </div>

        {/* Right: Icon Themes & Custom Upload */}
        <div className="md:col-span-2 space-y-3">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Icon Styles / Themes:</span>
            <span className="text-[11px] text-slate-400 font-normal">Koi bhi ek select karein</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {themes.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    setSelectedThemeId(theme.id);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.bgGrad} flex items-center justify-center text-white font-extrabold text-xs shadow-xs shrink-0 border border-white/20`}
                  >
                    <span className="text-amber-300 font-black">{theme.symbol}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {theme.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                      {theme.tag}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                      {theme.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Option: Upload your own Custom Photo / Shop Board */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-slate-700" />
                <span>Apna Custom Icon Ya Shop Ka Logo Lagayein</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Aap phone ki gallery ya computer se apni photo / logo upload kar sakte hain
              </p>
            </div>

            <label className="cursor-pointer px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0 text-center">
              <span>Photo / File Chunein</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadCustomIcon}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* PWABuilder / APK note */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">PWABuilder / APK Banane Wale Tool Ke Liye Hidayat:</p>
          <p className="text-[11px] leading-relaxed text-amber-900">
            Jab aap PWABuilder ya kisi bhi APK builder me app ka link dalte hain, toh wo khud ba khud hamari app se ye naya <strong>512x512 Emerald & Gold icon</strong> utha leta hai. Agar kabhi wo aapse icon file mange, toh upar diye gaye <strong>"Download 512px PNG"</strong> button par click karke file upload kar dein!
          </p>
        </div>
      </div>
    </div>
  );
};
