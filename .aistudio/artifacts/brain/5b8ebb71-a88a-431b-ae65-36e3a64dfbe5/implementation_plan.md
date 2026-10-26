# PolyglotClock — Hourly Ambient Multilingual Vocabulary System (Revised)

An ambient, non-freezing desktop and web application where **almost the entirety of the viewport is dedicated to 6 words, their correct articles, and their dictionary forms** across **Ukrainian, English, German, French, Polish, and Latin**, automatically refreshing every hour (or customized interval) with absolute linguistic accuracy and zero freezing.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Dictionary Accuracy & Verified Lexicography Commitment**:
> - **Authoritative Reference Dictionaries**: Every single vocabulary entry is verified against established, standard academic dictionaries:
>   - **German (Deutsch)**: **Duden & DWDS** (Digitales Wörterbuch der deutschen Sprache). Exact grammatical gender and articles (e.g. ***das* Buch** [neutrum], ***der* Baum** [maskulin], ***die* Sonne** [feminin]).
>   - **French (Français)**: **Le Robert & Dictionnaire de l'Académie française**. Exact articles with elision (e.g. ***le* livre** [m.], ***la* maison** [f.], ***l'*eau** [f.]).
>   - **Ukrainian (Українська)**: **Словник української мови (СУМ-11 / Горох)**. Verified grammatical gender (ч.р., ж.р., с.р.) with correct accent stress (e.g. **кни́га** [ж.р. / ця], **де́рево** [с.р. / те], **сонце** [с.р. / те]).
>   - **Polish (Polski)**: **Słownik Języka Polskiego (PWN & SJP)**. Verified gender (męski, żeński, nijaki) and demonstrative marker (e.g. **książka** [ż. / ta], **drzewo** [n. / to], **słońce** [n. / to]).
>   - **Latin (Lingua Latina)**: **Lewis & Short Latin Dictionary & Gaffiot**. Full dictionary entry with genitive ending, gender designation, and declension stem (e.g. **liber, librī** [m.], **arbor, arboris** [f.], **sōl, sōlis** [m.]).
>   - **English**: **Oxford English Dictionary & Merriam-Webster**. Definite/indefinite article usage and part of speech (e.g. ***the* book**, ***the* tree**, ***the* sun**).
> - **Dominant Word-Centric Viewport**: Over 90% of the screen is dedicated to the 6 synchronized language panels with massive typography, making the word, article, and gender immediately readable from across the room.
> - **Zero English Sentence Bloat**: No redundant `exampleEn` sentences cluttering the screen.
> - **Secondary Discovery Drawer**: Subtle, unobtrusive drawer for Proto-Indo-European (PIE) cognate root and brief authentic usage notes, keeping the ambient view pure and focused.
> - **Non-Freezing Engine**: Background-safe `Date.now()` timestamp math that stays perfectly in sync without freezing or timer drift.

---

### 1. Overview & Core Concept

**PolyglotClock** is an ambient desktop instrument for language acquisition. It provides constant, passive visual immersion in six languages side-by-side.

Every hour, the display seamlessly transitions to a new concept (e.g., *Book, Sun, Water, Bread, Tree, Fire, Heart, Peace, Night, Truth, Voice, Star, Earth, Sea, Wind, Eye, Hand, Road, Time, Love, Light, Sky, Stone, Flower, Friend*), displaying the exact dictionary entry, gender, article, and native pronunciation in all 6 languages simultaneously.

---

### 2. User Experience & Visual Design

#### Viewport Layout (Word-First Canvas)
- **Top Control Bar (44px quiet strip)**:
  - App wordmark (`PolyglotClock`).
  - Next refresh countdown (`54:20 until next word`) with active progress bar.
  - Interval selector (`15m`, `30m`, `1h`, `2h`, `6h`, `12h`, `24h`).
  - Previous / Next word arrows & Pause/Resume toggle.
  - Audio speed / mute toggle, Light/Dark ambient theme toggle, and Desktop Install button.
- **Main 6-Word Stage (92%+ of Screen)**:
  - 2 rows × 3 columns grid on desktop displays (3 × 2 on mid-sized tablets, single column responsive on narrow mobile).
  - Each cell is engineered for immediate visual impact:
    - **Language Flag & Title**: Unboxed clean label (`🇩🇪 DEUTSCH`, `🇫🇷 FRANÇAIS`, `🇺🇦 УКРАЇНСЬКА`, `🇵🇱 POLSKI`, `🇬🇧 ENGLISH`, `🏛️ LATINA`).
    - **Article Callout**: Prominently emphasized definite article (e.g. `das`, `le`, `the`, `ta`, `ця`).
    - **Main Word**: High-contrast, large-scale serif or grotesque typography (2.75rem – 4.5rem).
    - **Grammatical Morphology**: Lexicographical gender tag and inflected dictionary form (e.g., German: `Neutrum · Pl. die Bücher`, Latin: `masculinum · gen. librī`, Ukrainian: `жін. рід · род. книги`).
    - **Native Speech Button**: One-click audio pronunciation powered by the Web Speech Synthesis API.
- **Collapsible Etymology Footnote**:
  - A discreet pull-tab at the bottom reveals the Proto-Indo-European root (e.g. `*bʰuk-` for beech/book, or `*sóh₂wl̥` for sun) and how the 6 words relate historically, without cluttering the main stage.

#### Visual Identity & Theme
- **Theme**: Ambient Slate Dark (`#0a0d14` canvas, `#141a29` cards) with Warm Gallery Light mode (`#faf9f5` canvas, `#ffffff` cards).
- **Typography**:
  - Words: `Playfair Display` or `Fraunces` for editorial elegance.
  - Articles & Labels: Monospace `IBM Plex Mono` / `tabular-nums` for crisp alignment.

---

### 3. Rigorous Lexicographical Dictionary Schema

Each word entry in the dataset is modeled with strict dictionary standards:

```typescript
export interface LanguageEntry {
  article: string;       // e.g. "das" (DE), "le" (FR), "the" (EN), "ця" (UK dem.), "ta" (PL dem.), "—" (LA)
  word: string;          // e.g. "Buch", "livre", "book", "книга", "książka", "liber"
  gender: string;        // e.g. "Neutrum (n.)", "Masculin (m.)", "Noun", "Жіночий рід", "Żeński", "Masculinum (m.)"
  dictionaryForm: string;// e.g. "das Buch, des Buches; Bücher", "liber, librī, m.", "кни́га, -и, ж."
  ipa: string;           // International Phonetic Alphabet pronunciation
  speechLang: string;    // BCP 47 language code: 'de-DE', 'fr-FR', 'en-US', 'uk-UA', 'pl-PL', 'it-IT'/'la'
}

export interface MultilingualWord {
  id: string;
  conceptEn: string;     // e.g. "Book"
  pieRoot?: string;      // e.g. "*bʰewg- / Proto-Germanic *bōks"
  etymologyNote?: string;// Historical linguistic connection
  languages: {
    de: LanguageEntry;   // Duden / DWDS verified
    fr: LanguageEntry;   // Le Robert verified
    uk: LanguageEntry;   // СУМ-11 verified
    pl: LanguageEntry;   // PWN / SJP verified
    la: LanguageEntry;   // Lewis & Short verified
    en: LanguageEntry;   // Oxford / Merriam-Webster verified
  };
}
```

---

### 4. Technical Architecture & Non-Freezing Clock Engine

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PolyglotClock Core PWA                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────────────────────┐             ┌────────────────────────────────┐
│   Non-Freezing Timer Engine     │             │ Verified Dictionary Data Store │
│  - Date.now() timestamp delta   │             │  - Duden / DWDS (German)       │
│  - setInterval(1000ms)          │             │  - Le Robert (French)          │
│  - visibilitychange Re-sync     │             │  - СУМ-11 (Ukrainian)          │
│  - Customizable Interval (1h)   │             │  - PWN / SJP (Polish)          │
│  - Persistent localStorage state│             │  - Lewis & Short (Latin)       │
│  - Zero freeze in dormant tabs  │             │  - Oxford / MW (English)       │
└────────────────┬────────────────┘             └────────────────┬───────────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                90%+ Full-Viewport 6-Word Stage (2 x 3 Grid)            │
│                                                                        │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌───────────┐ │
│  │ UKRAINIAN: ця [кни́га]   │ │ ENGLISH: the [book]     │ │ GERMAN:   │ │
│  │ жін. рід · /kˈnɪɦɑ/     │ │ noun · /bʊk/            │ │ das [Buch]│ │
│  │ СУМ-11 verified 🔊      │ │ Oxford verified 🔊      │ │ Neutrum 🔊│ │
│  └─────────────────────────┘ └─────────────────────────┘ └───────────┘ │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌───────────┐ │
│  │ FRENCH: le [livre]      │ │ POLISH: ta [książka]    │ │ LATIN:    │ │
│  │ masc. · /livʁ/          │ │ żeński · /ˈkɕɔ̃w̃ʂka/     │ │ liber, m. │ │
│  │ Le Robert verified 🔊   │ │ PWN verified 🔊         │ │ L&S ver.🔊│ │
│  └─────────────────────────┘ └─────────────────────────┘ └───────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Verification & Non-Freezing Guarantee
1. **Timestamp-Driven Drift Resistance**: No relying on single timers that freeze when browser tabs are throttled. On every frame/second and whenever the browser tab becomes active, `timeRemaining = targetTime - Date.now()`. If expired, it advances seamlessly.
2. **Offline & GitHub Pages Static Ready**: Pure client-side static PWA, zero API dependencies, installable on macOS, Windows, Linux, Android, and iOS. Ready for one-click static hosting on GitHub Pages.
