import React from 'react';
import { X, Volume2, Sparkles, BookOpen } from 'lucide-react';
import { MultilingualWord, LangCode, LANGUAGES } from '../types/dictionary';

interface EtymologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  word: MultilingualWord;
  onSpeak: (text: string, langCode: LangCode, bcp47Code: string) => void;
}

const LANGUAGE_ORDER: LangCode[] = ['uk', 'en', 'de', 'fr', 'pl', 'la'];

export const EtymologyDrawer: React.FC<EtymologyDrawerProps> = ({
  isOpen,
  onClose,
  word,
  onSpeak,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-[24px] bg-white border border-black/[0.08] shadow-2xl overflow-hidden text-[#1D1D1F]">
        {/* Apple Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] bg-white/95">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0071E3]" />
            <h3 className="font-semibold text-base tracking-tight text-[#1D1D1F]">
              Etymology & Usage — {word.conceptEn}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E5E5EA] hover:bg-[#D1D1D6] text-[#1D1D1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F5F5F7]/50">
          {/* PIE Root & Bridge (Apple HIG Grouped Inset) */}
          {word.pieRoot && (
            <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-sm">
              <div className="text-[11px] font-semibold text-[#0071E3] uppercase tracking-wider mb-1 font-tabular">
                Proto-Indo-European Root
              </div>
              <div className="font-tabular text-sm font-semibold text-[#1D1D1F] mb-1.5">
                {word.pieRoot}
              </div>
              {word.etymologyNote && (
                <p className="text-xs text-[#6E6E73] leading-relaxed">
                  {word.etymologyNote}
                </p>
              )}
            </div>
          )}

          {/* Native Example Sentences (Zero English translations as requested) */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <BookOpen className="w-4 h-4 text-[#86868B]" />
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B] font-tabular">
                Native Usage Sentences
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LANGUAGE_ORDER.map((code) => {
                const entry = word.languages[code];
                const langInfo = LANGUAGES[code];
                if (!entry) return null;

                return (
                  <div
                    key={code}
                    className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-sm hover:border-black/[0.12] transition-colors flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]">
                        <span>{langInfo.flag}</span>
                        <span>{langInfo.name}</span>
                        <span className="text-[#86868B] font-normal">
                          ({entry.article || '—'} {entry.word})
                        </span>
                      </div>
                      <button
                        onClick={() => onSpeak(entry.exampleSentence, code, langInfo.speechCode)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#0071E3] transition-colors"
                        title="Listen to native sentence"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-[#3A3A3C] leading-relaxed italic">
                      «{entry.exampleSentence}»
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Apple Footer with standard Done button */}
        <div className="px-6 py-3 border-t border-black/[0.06] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F] rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
