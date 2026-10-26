import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { LangCode, LANGUAGES, LanguageEntry } from '../types/dictionary';

interface LanguageWordCardProps {
  langCode: LangCode;
  entry: LanguageEntry;
  conceptEn: string;
  isSpeaking: boolean;
  onSpeak: (text: string, langCode: LangCode, bcp47Code: string) => void;
}

export const LanguageWordCard: React.FC<LanguageWordCardProps> = ({
  langCode,
  entry,
  isSpeaking,
  onSpeak,
}) => {
  const langInfo = LANGUAGES[langCode];

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speakText =
      entry.article && entry.article !== '—'
        ? `${entry.article} ${entry.word}`
        : entry.word;
    onSpeak(speakText, langCode, langInfo.speechCode);
  };

  return (
    <div
      onClick={handlePronounce}
      className="apple-card group relative flex flex-col justify-between p-6 sm:p-7 transition-all duration-200 cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePronounce(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`Pronounce ${entry.word} in ${langInfo.name}`}
    >
      {/* Top Header: Flag + Language Name + Audio Action */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-black/[0.05]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl sm:text-2xl select-none shrink-0" aria-hidden="true">
            {langInfo.flag}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#1D1D1F] tracking-tight truncate">
              {langInfo.nativeName}
            </span>
            <span className="text-[11px] text-[#86868B] font-tabular truncate">
              {langInfo.family}
            </span>
          </div>
        </div>

        {/* Apple Style Circular Speaker Button */}
        <button
          onClick={handlePronounce}
          aria-label={`Listen to ${entry.word}`}
          className={`flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0 ${
            isSpeaking
              ? 'bg-[#0071E3] text-white shadow-sm scale-105'
              : 'bg-[#F2F2F7] text-[#0071E3] group-hover:bg-[#E5E5EA]'
          }`}
          title="Click to hear native pronunciation"
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4 animate-pulse" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Dominant Stage: Article + Word */}
      <div className="my-auto py-5 sm:py-7 flex flex-col justify-center">
        {/* Article & Gender */}
        <div className="flex items-baseline gap-2 mb-1.5">
          {entry.article && entry.article !== '—' ? (
            <span className="font-tabular text-xl sm:text-2xl font-bold text-[#0071E3] tracking-tight">
              {entry.article}
            </span>
          ) : (
            <span className="text-xs text-[#86868B] italic font-tabular">
              {langCode === 'la' ? '(classical / no article)' : '—'}
            </span>
          )}
          <span className="text-xs text-[#6E6E73] font-medium">
            · {entry.gender}
          </span>
        </div>

        {/* Primary Word in Apple Display Typography */}
        <h2 className="font-apple-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1D1D1F] tracking-tight leading-none break-words">
          {entry.word}
        </h2>

        {/* Phonetic IPA guide */}
        <div className="mt-3 text-xs text-[#86868B] font-tabular">
          <span>{entry.ipa}</span>
        </div>
      </div>

      {/* Apple Footnote: Dictionary Inflection & Academic Source */}
      <div className="pt-3 border-t border-black/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#86868B]">
        <span className="truncate font-tabular text-[#6E6E73]" title={entry.dictionaryForm}>
          {entry.dictionaryForm}
        </span>
        <span className="shrink-0 font-medium text-[#86868B]">
          {langInfo.dictionarySource}
        </span>
      </div>
    </div>
  );
};
