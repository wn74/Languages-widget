import React, { useState, useMemo } from 'react';
import { X, Search, Star, Clock, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { DICTIONARY_WORDS } from '../data/words';
import { EXTENSIVE_WORD_LIST } from '../data/wordlist';
import { HistoryItem } from '../hooks/useHourlyEngine';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onSelectWord: (index: number) => void;
  history: HistoryItem[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  currentIndex,
  onSelectWord,
  history,
  favorites,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'favorites'>('all');

  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase();

    // Search inside extensive list or curated words
    if (activeTab === 'history') {
      return history.map((h) => {
        const found = DICTIONARY_WORDS.find((w) => w.id === h.wordId);
        const listIdx = EXTENSIVE_WORD_LIST.findIndex((w) => w.toLowerCase() === h.conceptEn.toLowerCase());
        return {
          word: found || {
            id: h.wordId,
            conceptEn: h.conceptEn,
            category: 'Dictionary' as const,
            languages: {
              uk: { article: '', word: h.conceptEn, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              en: { article: 'the', word: h.conceptEn, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              de: { article: '', word: h.conceptEn, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              fr: { article: '', word: h.conceptEn, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              pl: { article: '', word: h.conceptEn, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              la: { article: '—', word: '-', gender: '—', genderShort: '—', dictionaryForm: '—', ipa: '—', exampleSentence: '', partOfSpeech: '' },
            },
          },
          index: listIdx !== -1 ? listIdx : 0,
        };
      }).filter(({ word }) => !q || word.conceptEn.toLowerCase().includes(q));
    }

    if (activeTab === 'favorites') {
      return favorites.map((favId) => {
        const found = DICTIONARY_WORDS.find((w) => w.id === favId);
        const listIdx = EXTENSIVE_WORD_LIST.findIndex((w) => w.toLowerCase() === favId.toLowerCase());
        return {
          word: found || {
            id: favId,
            conceptEn: favId.charAt(0).toUpperCase() + favId.slice(1),
            category: 'Saved' as const,
            languages: {
              uk: { article: '', word: favId, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              en: { article: 'the', word: favId, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              de: { article: '', word: favId, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              fr: { article: '', word: favId, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              pl: { article: '', word: favId, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
              la: { article: '—', word: '-', gender: '—', genderShort: '—', dictionaryForm: '—', ipa: '—', exampleSentence: '', partOfSpeech: '' },
            },
          },
          index: listIdx !== -1 ? listIdx : 0,
        };
      }).filter(({ word }) => !q || word.conceptEn.toLowerCase().includes(q));
    }

    // "All" tab: search across extensive vocabulary index
    const matchingLemmas = EXTENSIVE_WORD_LIST.map((lemma, idx) => ({ lemma, idx })).filter(
      ({ lemma }) => !q || lemma.toLowerCase().includes(q)
    ).slice(0, 80);

    return matchingLemmas.map(({ lemma, idx }) => {
      const foundCurated = DICTIONARY_WORDS.find((w) => w.conceptEn.toLowerCase() === lemma.toLowerCase());
      if (foundCurated) {
        return { word: foundCurated, index: idx };
      }
      return {
        word: {
          id: lemma,
          conceptEn: lemma.charAt(0).toUpperCase() + lemma.slice(1),
          category: 'Nature & Life' as const,
          languages: {
            uk: { article: '', word: '(Wiktionary live)', gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
            en: { article: 'the', word: lemma, gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
            de: { article: '', word: '(Wiktionary live)', gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
            fr: { article: '', word: '(Wiktionary live)', gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
            pl: { article: '', word: '(Wiktionary live)', gender: '', genderShort: '', dictionaryForm: '', ipa: '', exampleSentence: '', partOfSpeech: '' },
            la: { article: '—', word: '-', gender: '—', genderShort: '—', dictionaryForm: '—', ipa: '—', exampleSentence: '', partOfSpeech: '' },
          },
        },
        index: idx,
      };
    });
  }, [search, activeTab, favorites, history]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[85vh] flex flex-col rounded-[24px] bg-white border border-black/[0.08] shadow-2xl overflow-hidden text-[#1D1D1F]">
        {/* Apple Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] bg-white/95">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0071E3]" />
            <h3 className="font-semibold text-base tracking-tight text-[#1D1D1F]">
              Multilingual Lexicon & History ({EXTENSIVE_WORD_LIST.length.toLocaleString()} words)
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

        {/* Apple Filter & Search Bar */}
        <div className="p-4 sm:px-6 border-b border-black/[0.06] bg-[#F5F5F7]/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" />
            <input
              type="text"
              placeholder="Search or enter any English word…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#E5E5EA]/70 focus:bg-white rounded-lg border border-transparent focus:border-[#0071E3]/30 outline-none text-[#1D1D1F] font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-0.5 p-1 bg-[#E5E5EA]/80 rounded-lg w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Lexicon Library ({EXTENSIVE_WORD_LIST.length.toLocaleString()})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Recent ({history.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'favorites'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* Word Table List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-black/[0.05]">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-[#86868B] text-xs">
              No matching words found for &ldquo;{search}&rdquo;. You can type any word in the search box in the header toolbar to fetch it directly from Wiktionary in real time!
            </div>
          ) : (
            filteredWords.map(({ word, index }) => {
              const isCurrent = index === currentIndex;
              const isFav = favorites.includes(word.id);

              return (
                <div
                  key={word.id + index}
                  className={`py-3 sm:py-3.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl transition-colors ${
                    isCurrent ? 'bg-[#0071E3]/5' : 'hover:bg-[#F5F5F7]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm sm:text-base text-[#1D1D1F]">
                        {word.conceptEn}
                      </span>
                      <span className="text-[11px] text-[#86868B]">· {word.category}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs text-[#6E6E73]">
                      <div>
                        <span>🇺🇦 </span>
                        <span className="text-[#1D1D1F] font-medium">
                          {word.languages.uk.article} {word.languages.uk.word}
                        </span>
                      </div>
                      <div>
                        <span>🇬🇧 </span>
                        <span className="text-[#1D1D1F] font-medium">
                          {word.languages.en.article} {word.languages.en.word}
                        </span>
                      </div>
                      <div>
                        <span>🇩🇪 </span>
                        <span className="text-[#1D1D1F] font-medium">
                          {word.languages.de.article} {word.languages.de.word}
                        </span>
                      </div>
                      <div>
                        <span>🇫🇷 </span>
                        <span className="text-[#1D1D1F] font-medium">
                          {word.languages.fr.article} {word.languages.fr.word}
                        </span>
                      </div>
                      <div>
                        <span>🇵🇱 </span>
                        <span className="text-[#1D1D1F] font-medium">
                          {word.languages.pl.article} {word.languages.pl.word}
                        </span>
                      </div>
                      <div>
                        <span>🏛️ </span>
                        <span className="text-[#1D1D1F] font-medium">
                          {word.languages.la.word}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleFavorite(word.id)}
                      aria-label="Star word"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isFav ? 'text-[#FF9500]' : 'text-[#86868B] hover:text-[#1D1D1F]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => {
                        onSelectWord(index);
                        onClose();
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-[#0071E3] text-white shadow-sm'
                          : 'bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1D1D1F]'
                      }`}
                    >
                      <span>Display</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
