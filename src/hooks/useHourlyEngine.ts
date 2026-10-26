import { useState, useEffect, useCallback, useRef } from 'react';
import { DICTIONARY_WORDS } from '../data/words';
import { EXTENSIVE_WORD_LIST } from '../data/wordlist';
import { MultilingualWord } from '../types/dictionary';
import { fetchWordFromWiktionary } from '../services/dictionaryService';

export interface IntervalOption {
  label: string;
  ms: number;
}

export const INTERVAL_OPTIONS: IntervalOption[] = [
  { label: '30 sec ', ms: 30 * 1000 },
  { label: '1 min', ms: 1 * 60 * 1000 },
  { label: '2 min', ms: 2 * 60 * 1000 },
  { label: '5 min', ms: 5 * 60 * 1000 },
  { label: '10 min', ms: 10 * 60 * 1000 },
  { label: '15 min', ms: 15 * 60 * 1000 },
  { label: '20 min', ms: 20 * 60 * 1000 },
  { label: '30 min', ms: 30 * 60 * 1000 },
  { label: '45 min', ms: 45 * 60 * 1000 },
  { label: '1 hour', ms: 60 * 60 * 1000 },
  { label: '2 hours', ms: 2 * 60 * 60 * 1000 },
  { label: '3 hours', ms: 3 * 60 * 60 * 1000 },
  { label: '4 hours', ms: 4 * 60 * 60 * 1000 },
  { label: '6 hours', ms: 6 * 60 * 60 * 1000 },
  { label: '8 hours', ms: 8 * 60 * 60 * 1000 },
  { label: '12 hours', ms: 12 * 60 * 60 * 1000 },
  { label: '24 hours', ms: 24 * 60 * 60 * 1000 },
];

const STORAGE_KEYS = {
  CURRENT_INDEX: 'polyglot_current_index_v2',
  TARGET_EPOCH: 'polyglot_target_epoch_v2',
  INTERVAL_MS: 'polyglot_interval_ms_v2',
  IS_PAUSED: 'polyglot_is_paused_v2',
  HISTORY: 'polyglot_word_history_v2',
  FAVORITES: 'polyglot_favorites_v2',
  CUSTOM_SEARCHES: 'polyglot_custom_searches_v2',
};

export interface HistoryItem {
  wordId: string;
  conceptEn: string;
  timestamp: number;
}

export function useHourlyEngine() {
  const totalWords = EXTENSIVE_WORD_LIST.length;

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalWords) return parsed;
    }
    const hour = Math.floor(Date.now() / (60 * 60 * 1000));
    return hour % totalWords;
  });

  const [intervalMs, setIntervalMsState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTERVAL_MS);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 60 * 60 * 1000; // 1 hour default
  });

  const [isPaused, setIsPaused] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.IS_PAUSED) === 'true';
  });

  const [targetEpoch, setTargetEpoch] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGET_EPOCH);
    const now = Date.now();
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > now) {
        return parsed;
      }
    }
    const nextTarget = now + 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEYS.TARGET_EPOCH, nextTarget.toString());
    return nextTarget;
  });

  const [remainingMs, setRemainingMs] = useState<number>(() => {
    return Math.max(0, targetEpoch - Date.now());
  });

  // Current active word state (can be fetched in real-time)
  const [currentWord, setCurrentWord] = useState<MultilingualWord>(() => {
    const initialLemma = EXTENSIVE_WORD_LIST[currentIndex] || 'sun';
    const found = DICTIONARY_WORDS.find((w) => w.conceptEn.toLowerCase() === initialLemma.toLowerCase());
    return found || DICTIONARY_WORDS[0];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const intervalMsRef = useRef(intervalMs);
  intervalMsRef.current = intervalMs;

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const targetEpochRef = useRef(targetEpoch);
  targetEpochRef.current = targetEpoch;

  const recordHistory = useCallback((word: MultilingualWord) => {
    setHistory((prev) => {
      const updated = [
        { wordId: word.id, conceptEn: word.conceptEn, timestamp: Date.now() },
        ...prev.filter((item) => item.wordId !== word.id),
      ].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load word (cached or real-time Wiktionary fetch)
  const loadWordByIndex = useCallback(
    async (idx: number) => {
      const safeIndex = ((idx % totalWords) + totalWords) % totalWords;
      setCurrentIndex(safeIndex);
      localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, safeIndex.toString());

      const nextEpoch = Date.now() + intervalMsRef.current;
      setTargetEpoch(nextEpoch);
      localStorage.setItem(STORAGE_KEYS.TARGET_EPOCH, nextEpoch.toString());
      setRemainingMs(intervalMsRef.current);

      const lemma = EXTENSIVE_WORD_LIST[safeIndex] || 'sun';

      // Check pre-seeded first
      const preSeeded = DICTIONARY_WORDS.find((w) => w.conceptEn.toLowerCase() === lemma.toLowerCase());
      if (preSeeded) {
        setCurrentWord(preSeeded);
        recordHistory(preSeeded);
        return;
      }

      setIsLoading(true);
      try {
        const fetched = await fetchWordFromWiktionary(lemma);
        setCurrentWord(fetched);
        recordHistory(fetched);
      } finally {
        setIsLoading(false);
      }
    },
    [totalWords, recordHistory]
  );

  // Search or fetch any custom English word in real time
  const searchWord = useCallback(
    async (englishQuery: string) => {
      const clean = englishQuery.trim().toLowerCase();
      if (!clean) return;

      setIsLoading(true);
      try {
        const word = await fetchWordFromWiktionary(clean);
        setCurrentWord(word);
        recordHistory(word);

        // Find index in wordlist if exists
        const listIdx = EXTENSIVE_WORD_LIST.findIndex((w) => w.toLowerCase() === clean);
        if (listIdx !== -1) {
          setCurrentIndex(listIdx);
          localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, listIdx.toString());
        }
      } finally {
        setIsLoading(false);
      }
    },
    [recordHistory]
  );

  // Visited stack for previous button navigation
  const visitedStackRef = useRef<number[]>([]);

  const getRandomIndex = useCallback(() => {
    if (totalWords <= 1) return 0;
    let nextIdx = Math.floor(Math.random() * totalWords);
    // Ensure we don't repeat the exact same word immediately
    if (nextIdx === currentIndexRef.current && totalWords > 1) {
      nextIdx = (nextIdx + 1) % totalWords;
    }
    return nextIdx;
  }, [totalWords]);

  const nextWord = useCallback(() => {
    visitedStackRef.current.push(currentIndexRef.current);
    // Keep stack bounded
    if (visitedStackRef.current.length > 50) {
      visitedStackRef.current.shift();
    }
    const randIdx = getRandomIndex();
    loadWordByIndex(randIdx);
  }, [getRandomIndex, loadWordByIndex]);

  const prevWord = useCallback(() => {
    if (visitedStackRef.current.length > 0) {
      const prevIdx = visitedStackRef.current.pop()!;
      loadWordByIndex(prevIdx);
    } else {
      loadWordByIndex((currentIndexRef.current - 1 + totalWords) % totalWords);
    }
  }, [totalWords, loadWordByIndex]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.IS_PAUSED, String(next));
      if (!next) {
        const nextEpoch = Date.now() + remainingMs;
        setTargetEpoch(nextEpoch);
        localStorage.setItem(STORAGE_KEYS.TARGET_EPOCH, nextEpoch.toString());
      }
      return next;
    });
  }, [remainingMs]);

  const setIntervalMs = useCallback((newMs: number) => {
    setIntervalMsState(newMs);
    localStorage.setItem(STORAGE_KEYS.INTERVAL_MS, newMs.toString());
    const nextEpoch = Date.now() + newMs;
    setTargetEpoch(nextEpoch);
    localStorage.setItem(STORAGE_KEYS.TARGET_EPOCH, nextEpoch.toString());
    setRemainingMs(newMs);
  }, []);

  const toggleFavorite = useCallback((wordId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(wordId)
        ? prev.filter((id) => id !== wordId)
        : [...prev, wordId];
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
      return next;
    });
  }, []);

    // Non-freezing drift checker with random next word selection
  const checkClock = useCallback(() => {
    if (isPausedRef.current) return;

    const now = Date.now();
    const currentTarget = targetEpochRef.current;
    const diff = currentTarget - now;

    if (diff <= 0) {
      visitedStackRef.current.push(currentIndexRef.current);
      const randIdx = getRandomIndex();
      loadWordByIndex(randIdx);
    } else {
      setRemainingMs(diff);
    }
  }, [getRandomIndex, loadWordByIndex]);

  useEffect(() => {
    const timer = setInterval(checkClock, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkClock();
      }
    };

    const handleWindowFocus = () => {
      checkClock();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [checkClock]);

  // Initial load
  useEffect(() => {
    loadWordByIndex(currentIndex);
  }, []); // Run once on mount

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return {
    currentWord,
    currentIndex,
    totalWords,
    intervalMs,
    isPaused,
    remainingMs,
    remainingFormatted: formatTime(remainingMs),
    isLoading,
    history,
    favorites,
    nextWord,
    prevWord,
    goToIndex: loadWordByIndex,
    searchWord,
    togglePause,
    setIntervalMs,
    toggleFavorite,
    isFavorite: favorites.includes(currentWord.id),
  };
}
