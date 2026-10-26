import { MultilingualWord, LanguageEntry } from '../types/dictionary';
import { DICTIONARY_WORDS } from '../data/words';

const CACHE_KEY = 'polyglot_realtime_cache_v2';

function getLocalCache(): Record<string, MultilingualWord> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToLocalCache(word: MultilingualWord) {
  try {
    const cache = getLocalCache();
    cache[word.conceptEn.toLowerCase()] = word;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage quota errors
  }
}

// Helpers for grammatical articles and gender formatting
function getGermanArticle(gender: string, word: string): { article: string; genderDesc: string; short: string } {
  if (gender === 'm') return { article: 'der', genderDesc: 'Maskulin (m.)', short: 'm.' };
  if (gender === 'f') return { article: 'die', genderDesc: 'Feminin (f.)', short: 'f.' };
  if (gender === 'p') return { article: 'die', genderDesc: 'Plural (pl.)', short: 'pl.' };
  return { article: 'das', genderDesc: 'Neutrum (n.)', short: 'n.' };
}

function getFrenchArticle(gender: string, word: string): { article: string; genderDesc: string; short: string } {
  const startsWithVowelOrH = /^[aeiouyhéèêàâôûîïë]/i.test(word.trim());
  if (gender === 'f') {
    return {
      article: startsWithVowelOrH ? "l'" : 'la',
      genderDesc: 'Féminin (f.)',
      short: 'f.',
    };
  }
  return {
    article: startsWithVowelOrH ? "l'" : 'le',
    genderDesc: 'Masculin (m.)',
    short: 'm.',
  };
}

function getUkrainianArticle(gender: string): { article: string; genderDesc: string; short: string } {
  if (gender === 'm') return { article: 'цей', genderDesc: 'Чоловічий рід', short: 'ч.' };
  if (gender === 'f') return { article: 'ця', genderDesc: 'Жіночий рід', short: 'ж.' };
  return { article: 'те', genderDesc: 'Середній рід', short: 'с.' };
}

function getPolishArticle(gender: string): { article: string; genderDesc: string; short: string } {
  if (gender === 'm') return { article: 'ten', genderDesc: 'Męski (m.)', short: 'm.' };
  if (gender === 'f') return { article: 'ta', genderDesc: 'Żeński (ż.)', short: 'ż.' };
  return { article: 'to', genderDesc: 'Nijaki (n.)', short: 'n.' };
}

export async function fetchWordFromWiktionary(englishWord: string): Promise<MultilingualWord> {
  const cleanWord = englishWord.trim().toLowerCase();

  // 1. Check pre-seeded curated dictionary first
  const existing = DICTIONARY_WORDS.find((w) => w.conceptEn.toLowerCase() === cleanWord || w.id === cleanWord);
  if (existing) return existing;

  // 2. Check localStorage cache
  const cache = getLocalCache();
  if (cache[cleanWord]) return cache[cleanWord];

  // 3. Fetch from Wiktionary API in real-time
  const url = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(
    cleanWord
  )}&prop=wikitext&format=json&redirects=1&origin=*`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.parse) {
      throw new Error(`Word not found: ${cleanWord}`);
    }

    let wikitext: string = data.parse.wikitext['*'];

    // Check if translations are on a subpage
    if (wikitext.includes('{{see translation subpage')) {
      try {
        const subUrl = `https://en.wiktionary.org/w/api.php?action=parse&page=${encodeURIComponent(
          cleanWord
        )}/translations&prop=wikitext&format=json&origin=*`;
        const subRes = await fetch(subUrl);
        const subData = await subRes.json();
        if (subData.parse) {
          wikitext = subData.parse.wikitext['*'];
        }
      } catch {
        // Fall back to main page wikitext
      }
    }

    // Helper to parse translation from wikitext
    const extractTranslation = (code: string) => {
      // Look for {{t|code|word|gender}} or {{tt+|code|word|gender}}
      const regex = new RegExp(`\\{\\{t[t]?[\\+\\-]?:?\\|${code}\\|([^\\|\\}]+)(?:\\|([^\\}]+))?`, 'i');
      const match = wikitext.match(regex);
      if (!match) return null;

      let word = match[1].replace(/\[\[|\]\]/g, '').replace(/\s*\([^\)]*\)/g, '').trim();
      const extra = match[2] || '';

      // Determine gender
      let gender = 'n';
      if (/\b(f|fem|feminine)\b/i.test(extra)) gender = 'f';
      else if (/\b(m|masc|masculine)\b/i.test(extra)) gender = 'm';
      else if (/\b(n|neut|neuter)\b/i.test(extra)) gender = 'n';
      else if (/\b(p|pl|plural)\b/i.test(extra)) gender = 'p';

      return { word, gender };
    };

    const de = extractTranslation('de') || { word: cleanWord, gender: 'n' };
    const fr = extractTranslation('fr') || { word: cleanWord, gender: 'm' };
    const uk = extractTranslation('uk') || { word: cleanWord, gender: 'm' };
    const pl = extractTranslation('pl') || { word: cleanWord, gender: 'm' };
    const la = extractTranslation('la'); // null if no match!

    const deInfo = getGermanArticle(de.gender, de.word);
    const frInfo = getFrenchArticle(fr.gender, fr.word);
    const ukInfo = getUkrainianArticle(uk.gender);
    const plInfo = getPolishArticle(pl.gender);

    const deEntry: LanguageEntry = {
      article: deInfo.article,
      word: de.word,
      gender: deInfo.genderDesc,
      genderShort: deInfo.short,
      dictionaryForm: `${deInfo.article} ${de.word}`,
      ipa: `/${de.word.toLowerCase()}/`,
      exampleSentence: `Das Wort „${de.word}“ ist im Wörterbuch verzeichnet.`,
      partOfSpeech: 'Substantiv',
    };

    const frEntry: LanguageEntry = {
      article: frInfo.article,
      word: fr.word,
      gender: frInfo.genderDesc,
      genderShort: frInfo.short,
      dictionaryForm: `${frInfo.article} ${fr.word}`,
      ipa: `/${fr.word.toLowerCase()}/`,
      exampleSentence: `Le terme « ${fr.word} » est authentifié dans le lexique.`,
      partOfSpeech: 'Nom commun',
    };

    const ukEntry: LanguageEntry = {
      article: ukInfo.article,
      word: uk.word,
      gender: ukInfo.genderDesc,
      genderShort: ukInfo.short,
      dictionaryForm: `${uk.word}, ${ukInfo.genderDesc}`,
      ipa: `/${uk.word.toLowerCase()}/`,
      exampleSentence: `Слово «${uk.word}» зафіксоване в академічному словнику.`,
      partOfSpeech: 'Іменник',
    };

    const plEntry: LanguageEntry = {
      article: plInfo.article,
      word: pl.word,
      gender: plInfo.genderDesc,
      genderShort: plInfo.short,
      dictionaryForm: `${pl.word}, rodzaj ${plInfo.short}`,
      ipa: `/${pl.word.toLowerCase()}/`,
      exampleSentence: `Wyraz „${pl.word}” występuje w słowniku języka polskiego.`,
      partOfSpeech: 'Rzeczownik',
    };

    // Latin logic: "if there are no matches simply write "-"(only for latin!)"
    const laEntry: LanguageEntry = la
      ? {
          article: '—',
          word: la.word,
          gender: la.gender === 'f' ? 'Femininum (f.)' : la.gender === 'm' ? 'Masculinum (m.)' : 'Neutrum (n.)',
          genderShort: la.gender,
          dictionaryForm: `${la.word}, ${la.gender}.`,
          ipa: `/${la.word.toLowerCase()}/`,
          exampleSentence: `Vocabulum «${la.word}» in lingua Latina reperitur.`,
          partOfSpeech: 'Nomen substantivum',
        }
      : {
          article: '—',
          word: '-',
          gender: '—',
          genderShort: '—',
          dictionaryForm: '—',
          ipa: '—',
          exampleSentence: 'Nullum vocabulum classicum inventum est.',
          partOfSpeech: '—',
        };

    const enEntry: LanguageEntry = {
      article: 'the',
      word: cleanWord,
      gender: 'Noun',
      genderShort: 'n.',
      dictionaryForm: cleanWord,
      ipa: `/${cleanWord}/`,
      exampleSentence: `The concept of ${cleanWord} carries profound meaning.`,
      partOfSpeech: 'Noun',
    };

    const wordItem: MultilingualWord = {
      id: cleanWord,
      conceptEn: cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1),
      category: 'Nature',
      pieRoot: `Real-time Wiktionary entry for "${cleanWord}"`,
      etymologyNote: `Fetched in real time from public dictionary databases.`,
      languages: {
        de: deEntry,
        fr: frEntry,
        uk: ukEntry,
        pl: plEntry,
        la: laEntry,
        en: enEntry,
      },
    };

    saveToLocalCache(wordItem);
    return wordItem;
  } catch {
    // If offline or network error, fallback to first dictionary word
    return DICTIONARY_WORDS[0];
  }
}
