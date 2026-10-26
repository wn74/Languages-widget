import React, { useState, useEffect } from 'react';
import { useHourlyEngine } from './hooks/useHourlyEngine';
import { useSpeechPronunciation } from './hooks/useSpeechPronunciation';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Header } from './components/Header';
import { WordMatrix } from './components/WordMatrix';
import { EtymologyDrawer } from './components/EtymologyDrawer';
import { HistoryModal } from './components/HistoryModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';

export default function App() {
  const [isEtymologyOpen, setIsEtymologyOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGitHubPagesOpen, setIsGitHubPagesOpen] = useState(false);

  const {
    currentWord,
    currentIndex,
    intervalMs,
    isPaused,
    remainingFormatted,
    isLoading,
    history,
    favorites,
    nextWord,
    prevWord,
    goToIndex,
    searchWord,
    togglePause,
    setIntervalMs,
    toggleFavorite,
  } = useHourlyEngine();

  const { speak, speakingLang } = useSpeechPronunciation();
  const { isInstallable, install } = usePWAInstall();

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        nextWord();
      } else if (e.key === 'ArrowLeft') {
        prevWord();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextWord, prevWord, togglePause]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F5F5F7] text-[#1D1D1F] select-none">
      {/* Apple macOS / iPadOS Unified Toolbar Header (without top counter x of 26) */}
      <Header
        remainingFormatted={remainingFormatted}
        intervalMs={intervalMs}
        isPaused={isPaused}
        isLoading={isLoading}
        onTogglePause={togglePause}
        onNext={nextWord}
        onPrev={prevWord}
        onSelectInterval={setIntervalMs}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenEtymology={() => setIsEtymologyOpen(true)}
        onOpenGitHubPages={() => setIsGitHubPagesOpen(true)}
        onSearchWord={searchWord}
        isInstallable={isInstallable}
        onInstallApp={install}
      />

      {/* Main 6-Word Stage — Over 90% of screen */}
      <main className="flex-1 flex flex-col justify-center py-2 sm:py-4">
        <WordMatrix
          word={currentWord}
          speakingLang={speakingLang}
          onSpeak={speak}
        />
      </main>

      {/* Clean Apple Footer (Bottom line signaling how long till next card REMOVED) */}
      <footer className="w-full relative shrink-0 border-t border-black/[0.05] bg-white/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between text-[11px] text-[#86868B] font-tabular">
          <div className="flex items-center gap-2">
            <span>Concept: <strong className="text-[#1D1D1F] font-semibold">{currentWord.conceptEn}</strong></span>
            <span>·</span>
            <span>Category: {currentWord.category}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>&larr; &rarr; Navigate</span>
            <span>·</span>
            <span>Space: Pause / Resume</span>
            <span>·</span>
            <span>Click card to listen</span>
          </div>
        </div>
      </footer>

      {/* Apple Sheet Modals */}
      <EtymologyDrawer
        isOpen={isEtymologyOpen}
        onClose={() => setIsEtymologyOpen(false)}
        word={currentWord}
        onSpeak={speak}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        currentIndex={currentIndex}
        onSelectWord={goToIndex}
        history={history}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      <GitHubPagesModal
        isOpen={isGitHubPagesOpen}
        onClose={() => setIsGitHubPagesOpen(false)}
      />
    </div>
  );
}
