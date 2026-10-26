import React from 'react';
import { LangCode, MultilingualWord } from '../types/dictionary';
import { LanguageWordCard } from './LanguageWordCard';

interface WordMatrixProps {
  word: MultilingualWord;
  speakingLang: LangCode | null;
  onSpeak: (text: string, langCode: LangCode, bcp47Code: string) => void;
}

const LANGUAGE_ORDER: LangCode[] = ['uk', 'en', 'de', 'fr', 'pl', 'la'];

export const WordMatrix: React.FC<WordMatrixProps> = ({
  word,
  speakingLang,
  onSpeak,
}) => {
  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center">
      {/* 6-Card Apple Grid: 2 rows x 3 columns on desktop, 3 x 2 on tablets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full">
        {LANGUAGE_ORDER.map((code) => {
          const entry = word.languages[code];
          if (!entry) return null;

          return (
            <LanguageWordCard
              key={code}
              langCode={code}
              entry={entry}
              conceptEn={word.conceptEn}
              isSpeaking={speakingLang === code}
              onSpeak={onSpeak}
            />
          );
        })}
      </div>
    </div>
  );
};
