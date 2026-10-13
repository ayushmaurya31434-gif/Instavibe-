import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Apple,
  Monitor,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOneClickInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden text-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg insta-gradient-border p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[6.5px] flex items-center justify-center">
                <Download className="w-4 h-4 text-pink-500" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm">InstaVibe App Download / Install</h3>
              <p className="text-[11px] text-zinc-400">Apne phone ya computer me install karein</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick One-Click Install if supported by browser */}
        {isInstallable && !isInstalled && (
          <div className="p-4 mx-4 mt-4 rounded-xl insta-gradient-border p-[1px]">
            <div className="bg-zinc-900 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Direct One-Click Install Ready</p>
                  <p className="text-[11px] text-zinc-300">Aapka browser direct app install support karta hai!</p>
                </div>
              </div>
              <button
                onClick={handleOneClickInstall}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-lg text-xs font-bold text-white whitespace-nowrap shadow-md active:scale-95 transition-all"
              >
                Install Now
              </button>
            </div>
          </div>
        )}

        {/* Device Switcher Tabs */}
        <div className="flex border-b border-zinc-800 mt-3 px-4 gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'android'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Phone</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'ios'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActiveTab('pc')}
            className={`flex items-center gap-2 py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'pc'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Computer / Laptop</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="p-5 space-y-4 text-xs">
          {activeTab === 'android' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Google Chrome me kholein</p>
                  <p className="text-zinc-400 mt-0.5">Apne phone ke Chrome browser me ye link open karein.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white">Menu par tap karein</p>
                  <p className="text-zinc-400 mt-0.5">Top-right corner me 3 dots (⋮) par click karein.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white">'Install app' ya 'Add to Home screen' chunein</p>
                  <p className="text-zinc-400 mt-0.5">App turant aapke phone ke app drawer aur home screen me add ho jayegi!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Safari Browser me kholein</p>
                  <p className="text-zinc-400 mt-0.5">iPhone par Safari browser me is website link ko open karein.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white">Share icon par tap karein</p>
                  <p className="text-zinc-400 mt-0.5">Screen ke bottom me square + arrow (⎋ Share) button dabayein.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-semibold text-white">'Add to Home Screen' (होम स्क्रीन पर जोड़ें)</p>
                  <p className="text-zinc-400 mt-0.5">Scroll karke <strong>Add to Home Screen</strong> dabayein aur top right me <strong>Add</strong> par click karein.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pc' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-semibold text-white">Chrome ya Edge browser me URL bar dekhein</p>
                  <p className="text-zinc-400 mt-0.5">URL ke right side me ek chhota 💻 ya ⬇️ <strong>Install</strong> icon dikhai dega.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
                <span className="w-6 h-6 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-semibold text-white">'Install' button par click karein</p>
                  <p className="text-zinc-400 mt-0.5">Popup aane par 'Install' dabayein. Ye Desktop app ki tarah alag window me khul jayega!</p>
                </div>
              </div>
            </div>
          )}

          {/* Copy link box */}
          <div className="pt-2 border-t border-zinc-900">
            <span className="text-[11px] text-zinc-400 block mb-1.5 font-medium">
              Apne phone par kholne ke liye Link copy karein:
            </span>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1.5">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="bg-transparent text-xs text-zinc-300 px-2 w-full focus:outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Theek hai, Samajh gaya (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
