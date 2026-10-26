import { useState, useCallback, useEffect } from 'react';
import { LangCode } from '../types/dictionary';

export function useSpeechPronunciation() {
  const [speakingLang, setSpeakingLang] = useState<LangCode | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, langCode: LangCode, bcp47Code: string) => {
    if (!isSupported) return;

    try {
      window.speechSynthesis.cancel();

      // Clean text: strip stress marks, articles if needed, or speak full article + word for natural prosody
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bcp47Code;
      utterance.rate = 0.9; // Slightly slower for language learners

      // Find best matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(bcp47Code.slice(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setSpeakingLang(langCode);
      };

      utterance.onend = () => {
        setSpeakingLang(null);
      };

      utterance.onerror = () => {
        setSpeakingLang(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeakingLang(null);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setSpeakingLang(null);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    speakingLang,
    isSupported,
  };
}
