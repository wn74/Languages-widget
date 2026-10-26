import React, { useState } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Info,
  Download,
  Share2,
  Search,
  Loader2,
} from 'lucide-react';
import { INTERVAL_OPTIONS } from '../hooks/useHourlyEngine';

interface HeaderProps {
  remainingFormatted: string;
  intervalMs: number;
  isPaused: boolean;
  isLoading: boolean;
  onTogglePause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectInterval: (ms: number) => void;
  onOpenHistory: () => void;
  onOpenEtymology: () => void;
  onOpenGitHubPages: () => void;
  onSearchWord: (word: string) => void;
  isInstallable: boolean;
  onInstallApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  remainingFormatted,
  intervalMs,
  isPaused,
  isLoading,
  onTogglePause,
  onNext,
  onPrev,
  onSelectInterval,
  onOpenHistory,
  onOpenEtymology,
  onOpenGitHubPages,
  onSearchWord,
  isInstallable,
  onInstallApp,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchWord(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-xl border-b border-black/[0.08] sticky top-0 z-40 select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: macOS Traffic Lights & Title (Top counter x of 26 removed as requested!) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 pr-1" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
          </div>

          <a
            href="/"
            className="text-[15px] font-semibold tracking-tight text-[#1D1D1F] hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            PolyglotClock
          </a>

          {/* Loading status spinner */}
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-[#0071E3] font-medium animate-in fade-in">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Fetching…</span>
            </div>
          )}
        </div>

        {/* Zone 2: Real-time Word Search & Apple Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Real-time Wiktionary Search Field */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-36 lg:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#86868B]" />
            <input
              type="text"
              placeholder="Fetch any word…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-[#F2F2F7] focus:bg-white rounded-lg border border-black/[0.04] focus:border-[#0071E3]/40 outline-none text-[#1D1D1F] font-medium transition-all"
            />
          </form>

          {/* Apple Live Countdown Pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F2F7] border border-black/[0.04] text-[12px] font-tabular font-medium text-[#1D1D1F]"
            title="Time remaining until next automatic word rotation"
          >
            <Clock className={`w-3.5 h-3.5 ${isPaused ? 'text-[#FF9500]' : 'text-[#34C759]'}`} />
            <span>{isPaused ? 'Paused' : remainingFormatted}</span>
          </div>

          {/* Apple Interval Picker */}
          <div className="relative hidden xs:block">
            <label htmlFor="apple-interval-select" className="sr-only">
              Refresh Interval
            </label>
            <select
              id="apple-interval-select"
              value={intervalMs}
              onChange={(e) => onSelectInterval(Number(e.target.value))}
              className="appearance-none bg-[#F2F2F7] hover:bg-[#E5E5EA] border border-black/[0.04] text-[#1D1D1F] text-xs font-medium px-3 py-1.5 pr-6 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30"
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.ms} value={opt.ms}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#86868B]">
              ▼
            </span>
          </div>

          {/* Apple Navigation Cluster */}
          <div className="flex items-center bg-[#F2F2F7] p-0.5 rounded-lg border border-black/[0.04]">
            <button
              onClick={onPrev}
              aria-label="Previous word"
              title="Previous word (Left Arrow)"
              className="p-1 rounded-md text-[#1D1D1F] hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePause}
              aria-label={isPaused ? 'Resume' : 'Pause'}
              title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
              className={`p-1 rounded-md transition-all ${
                isPaused
                  ? 'bg-[#FF9500] text-white shadow-sm'
                  : 'text-[#1D1D1F] hover:bg-white hover:shadow-sm'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onNext}
              aria-label="Next word"
              title="Next word (Right Arrow)"
              className="p-1 rounded-md text-[#1D1D1F] hover:bg-white hover:shadow-sm transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zone 3: Apple Action Toolbar Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Catalog Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] border border-black/[0.04] rounded-lg text-xs font-medium text-[#1D1D1F] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0071E3]" />
            <span className="hidden sm:inline">Dictionary</span>
          </button>

          {/* Etymology Info Button */}
          <button
            onClick={onOpenEtymology}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] border border-black/[0.04] rounded-lg text-xs font-medium text-[#1D1D1F] transition-colors"
            title="Inspect etymology & native usage sentences"
          >
            <Info className="w-3.5 h-3.5 text-[#0071E3]" />
            <span className="hidden md:inline">Etymology</span>
          </button>

          {/* GitHub Pages / PWA Install Button */}
          {isInstallable ? (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-lg text-xs font-medium shadow-sm transition-colors active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          ) : (
            <button
              onClick={onOpenGitHubPages}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] border border-black/[0.04] rounded-lg text-xs font-medium text-[#1D1D1F] transition-colors"
              title="GitHub Pages hosting guide"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0071E3]" />
              <span className="hidden md:inline">GitHub Pages</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
