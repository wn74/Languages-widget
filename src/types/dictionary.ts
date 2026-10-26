export type LangCode = 'uk' | 'en' | 'de' | 'fr' | 'pl' | 'la';

export interface LanguageInfo {
  code: LangCode;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  dictionarySource: string;
  family: string;
}

export interface LanguageEntry {
  article: string;
  word: string;
  gender: string;
  genderShort: string;
  dictionaryForm: string;
  ipa: string;
  exampleSentence: string;
  partOfSpeech: string;
}

export interface MultilingualWord {
  id: string;
  conceptEn: string;
  category: 'Nature' | 'Mind & Culture' | 'Time & Space' | 'Human & Life' | 'Society' | 'Elements';
  pieRoot?: string;
  etymologyNote?: string;
  languages: Record<LangCode, LanguageEntry>;
}

export const LANGUAGES: Record<LangCode, LanguageInfo> = {
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    dictionarySource: 'Duden & DWDS',
    family: 'West Germanic',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    dictionarySource: 'Le Robert',
    family: 'Gallo-Romance',
  },
  uk: {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    speechCode: 'uk-UA',
    dictionarySource: 'СУМ-11 / Горох',
    family: 'East Slavic',
  },
  pl: {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    speechCode: 'pl-PL',
    dictionarySource: 'PWN / SJP',
    family: 'West Slavic',
  },
  la: {
    code: 'la',
    name: 'Latin',
    nativeName: 'Lingua Latina',
    flag: '🏛️',
    speechCode: 'it-IT',
    dictionarySource: 'Lewis & Short',
    family: 'Italic / Classical',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    speechCode: 'en-US',
    dictionarySource: 'Oxford / MW',
    family: 'West Germanic',
  },
};
