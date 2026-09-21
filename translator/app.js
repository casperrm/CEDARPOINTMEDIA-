/* ==========================================================================
   Hamed Translator — everyday voice translator
   Done by Mhmd Rmaity
   English · Arabic · Chinese  <->  French (with regional accents)

   Everything runs in the browser: speech recognition and speech synthesis
   come from the Web Speech API, translation from public translation
   endpoints (tried in order, so one being down is not a problem).
   ========================================================================== */

"use strict";

/* -------------------------------------------------------------------------
   1. Languages, accents and voices
   ---------------------------------------------------------------------- */

const LANGS = {
  auto: {
    label: "Detect",
    native: "Auto",
    flag: "✨",
    dir: "ltr",
    c1: "#475569",
    accents: []
  },
  en: {
    label: "English",
    native: "English",
    flag: "🇬🇧",
    dir: "ltr",
    c1: "#1d4ed8",
    accents: [
      { code: "en-GB", label: "British 🇬🇧" },
      { code: "en-US", label: "American 🇺🇸" },
      { code: "en-AU", label: "Australian 🇦🇺" },
      { code: "en-CA", label: "Canadian 🇨🇦" },
      { code: "en-IN", label: "Indian 🇮🇳" }
    ]
  },
  ar: {
    label: "Arabic",
    native: "العربية",
    flag: "🇱🇧",
    dir: "rtl",
    c1: "#047857",
    accents: [
      { code: "ar-LB", label: "Lebanese 🇱🇧 لبناني" },
      { code: "ar-SY", label: "Syrian 🇸🇾 سوري" },
      { code: "ar-EG", label: "Egyptian 🇪🇬 مصري" },
      { code: "ar-SA", label: "Gulf 🇸🇦 خليجي" },
      { code: "ar-AE", label: "Emirati 🇦🇪 إماراتي" },
      { code: "ar-MA", label: "Moroccan 🇲🇦 مغربي" },
      { code: "ar-XA", label: "Modern standard فصحى" }
    ]
  },
  zh: {
    label: "Chinese",
    native: "中文",
    flag: "🇨🇳",
    dir: "ltr",
    c1: "#b91c1c",
    accents: [
      { code: "zh-CN", label: "Mandarin 🇨🇳 普通话" },
      { code: "zh-TW", label: "Taiwan 🇹🇼 國語" },
      { code: "zh-HK", label: "Hong Kong 🇭🇰" },
      { code: "yue-Hant-HK", label: "Cantonese 廣東話" }
    ]
  },
  fr: {
    label: "French",
    native: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    c1: "#0f2a5c",
    accents: [
      { code: "fr-FR", label: "France 🇫🇷" },
      { code: "fr-CI", label: "Côte d'Ivoire 🇨🇮" },
      { code: "fr-SN", label: "Sénégal 🇸🇳" },
      { code: "fr-MA", label: "Maroc 🇲🇦" },
      { code: "fr-CA", label: "Canada / Québec 🇨🇦" },
      { code: "fr-BE", label: "Belgique 🇧🇪" },
      { code: "fr-CH", label: "Suisse 🇨🇭" }
    ]
  }
};

const SOURCE_ORDER = ["auto", "en", "ar", "zh", "fr"];
const TARGET_ORDER = ["fr", "en", "ar", "zh"];

/* -------------------------------------------------------------------------
   2. State
   ---------------------------------------------------------------------- */

const STORE_KEY = "hamed-translator:v1";
const LEGACY_KEY = "nour-translator:v1";

const state = {
  source: "auto",
  target: "fr",
  accents: { en: "en-GB", ar: "ar-LB", zh: "zh-CN", fr: "fr-FR" },
  category: "greetings",
  theme: "auto",
  lastReturn: "en",     // where "auto" sends French back to
  history: [],
  saved: [],
  lastResult: null
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    Object.assign(state, saved, { accents: Object.assign({}, state.accents, saved.accents) });
  } catch (err) {
    console.warn("Could not read saved settings:", err);
  }
}

function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      source: state.source,
      target: state.target,
      accents: state.accents,
      category: state.category,
      theme: state.theme,
      lastReturn: state.lastReturn,
      history: state.history.slice(0, 40),
      saved: state.saved.slice(0, 100)
    }));
  } catch (err) {
    console.warn("Could not save settings:", err);
  }
}

/* -------------------------------------------------------------------------
   3. Small helpers
   ---------------------------------------------------------------------- */

const $ = (id) => document.getElementById(id);

const el = {
  sourceChips: $("sourceChips"),
  targetChips: $("targetChips"),
  sourceAccent: $("sourceAccent"),
  targetAccent: $("targetAccent"),
  sourceTitle: $("sourceTitle"),
  targetTitle: $("targetTitle"),
  sourceText: $("sourceText"),
  targetText: $("targetText"),
  meta: $("meta"),
  micBtn: $("micBtn"),
  micStatus: $("micStatus"),
  translateBtn: $("translateBtn"),
  swapBtn: $("swapBtn"),
  clearBtn: $("clearBtn"),
  copyBtn: $("copyBtn"),
  saveBtn: $("saveBtn"),
  listenSourceBtn: $("listenSourceBtn"),
  listenTargetBtn: $("listenTargetBtn"),
  themeBtn: $("themeBtn"),
  phraseCats: $("phraseCats"),
  phraseList: $("phraseList"),
  historyList: $("historyList"),
  savedList: $("savedList"),
  clearHistoryBtn: $("clearHistoryBtn"),
  toast: $("toast")
};

let toastTimer = null;
function toast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("is-visible"), 2200);
}

function baseOf(code) {
  return String(code || "").split("-")[0].toLowerCase();
}

/** Which of our four languages an accent code belongs to (yue -> zh). */
function langKeyFor(code) {
  const base = baseOf(code);
  if (base === "yue") return "zh";
  return LANGS[base] ? base : "en";
}

/** Guess the language of a piece of text from the script it is written in. */
function detectLang(text) {
  if (/[؀-ۿݐ-ݿ]/.test(text)) return "ar";
  if (/[一-鿿㐀-䶿]/.test(text)) return "zh";
  if (/[àâçéèêëîïôûùüœ]/i.test(text)) return "fr";
  const frenchWords = /\b(je|tu|nous|vous|est|les|des|une|pour|avec|bonjour|merci|s'il)\b/i;
  if (frenchWords.test(text)) return "fr";
  return "en";
}

/* -------------------------------------------------------------------------
   4. Translation providers (tried in order)
   ---------------------------------------------------------------------- */

const cache = new Map();

async function fetchJSON(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const PROVIDERS = [
  {
    name: "Google",
    code: (lang) => (lang === "zh" ? "zh-CN" : lang),
    async run(text, from, to) {
      const url = "https://translate.googleapis.com/translate_a/single?client=gtx" +
        "&sl=" + encodeURIComponent(from) +
        "&tl=" + encodeURIComponent(to) +
        "&dt=t&q=" + encodeURIComponent(text);
      const data = await fetchJSON(url);
      const chunks = Array.isArray(data[0]) ? data[0] : [];
      const out = chunks.map((c) => (c && c[0]) || "").join("");
      if (!out.trim()) throw new Error("empty answer");
      return { text: out, detected: data[2] || from };
    }
  },
  {
    name: "Lingva",
    code: (lang) => (lang === "zh" ? "zh" : lang),
    async run(text, from, to) {
      const url = "https://lingva.ml/api/v1/" + encodeURIComponent(from) + "/" +
        encodeURIComponent(to) + "/" + encodeURIComponent(text);
      const data = await fetchJSON(url);
      if (!data || !data.translation) throw new Error("empty answer");
      return { text: data.translation, detected: from };
    }
  },
  {
    name: "MyMemory",
    code: (lang) => (lang === "zh" ? "zh-CN" : lang),
    async run(text, from, to) {
      const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) +
        "&langpair=" + encodeURIComponent(from) + "|" + encodeURIComponent(to);
      const data = await fetchJSON(url);
      const out = data && data.responseData && data.responseData.translatedText;
      if (!out) throw new Error("empty answer");
      return { text: out, detected: from };
    }
  }
];

/** Look for an exact phrasebook match — instant and works offline. */
function phrasebookLookup(text, from, to) {
  const needle = text.trim().toLowerCase();
  if (!needle) return null;
  for (const cat of PHRASEBOOK) {
    for (const item of cat.items) {
      const candidate = item[from];
      if (candidate && candidate.trim().toLowerCase() === needle && item[to]) {
        return { text: item[to], detected: from, provider: "Phrasebook" };
      }
    }
  }
  return null;
}

async function translate(text, from, to) {
  const key = from + "|" + to + "|" + text;
  if (cache.has(key)) return cache.get(key);

  const offline = from !== "auto" ? phrasebookLookup(text, from, to) : null;
  if (offline) {
    cache.set(key, offline);
    return offline;
  }

  const errors = [];
  for (const provider of PROVIDERS) {
    // Only Google can auto-detect; give the others our own guess.
    const sourceLang = from === "auto" && provider.name !== "Google" ? detectLang(text) : from;
    if (baseOf(sourceLang) === baseOf(to)) {
      return { text: text, detected: sourceLang, provider: "Same language" };
    }
    try {
      const result = await provider.run(text, provider.code(sourceLang), provider.code(to));
      const value = {
        text: result.text,
        detected: baseOf(result.detected) || baseOf(sourceLang),
        provider: provider.name
      };
      cache.set(key, value);
      return value;
    } catch (err) {
      errors.push(provider.name + ": " + err.message);
    }
  }
  throw new Error("No translation service answered (" + errors.join(" · ") + ")");
}

/* -------------------------------------------------------------------------
   5. Speaking out loud (speech synthesis)
   ---------------------------------------------------------------------- */

const synth = window.speechSynthesis || null;
let voices = [];

function refreshVoices() {
  voices = synth ? synth.getVoices() : [];
}

if (synth) {
  refreshVoices();
  synth.addEventListener("voiceschanged", refreshVoices);
}

/**
 * Pick the closest available voice: exact accent first (fr-CA, ar-LB…),
 * then any voice of the same language, then nothing.
 */
function pickVoice(locale) {
  if (!voices.length) refreshVoices();
  const wanted = locale.toLowerCase();
  const base = baseOf(locale);

  const exact = voices.filter((v) => v.lang.toLowerCase().replace("_", "-") === wanted);
  if (exact.length) return exact.find((v) => v.localService) || exact[0];

  const sameLang = voices.filter((v) => baseOf(v.lang.replace("_", "-")) === base);
  if (sameLang.length) {
    // Prefer a voice whose name hints at the region we asked for.
    const region = locale.split("-").slice(1).join("-").toLowerCase();
    const hinted = region && sameLang.find((v) =>
      v.lang.toLowerCase().includes(region) || v.name.toLowerCase().includes(region));
    return hinted || sameLang.find((v) => v.localService) || sameLang[0];
  }
  return null;
}

let speakingButton = null;
const missingVoiceWarned = new Set();

function speak(text, locale, button) {
  if (!synth) { toast("This browser cannot speak out loud."); return; }
  if (!text || !text.trim()) { toast("Nothing to read yet."); return; }

  synth.cancel();
  if (speakingButton) speakingButton.classList.remove("is-on");

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(locale);
  utterance.lang = locale;
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  utterance.pitch = 1;

  if (button) {
    speakingButton = button;
    button.classList.add("is-on");
    const done = () => button.classList.remove("is-on");
    utterance.onend = done;
    utterance.onerror = done;
  }

  synth.speak(utterance);

  if (!voice && !missingVoiceWarned.has(locale)) {
    missingVoiceWarned.add(locale);
    toast("No " + locale + " voice on this device — using the closest one.");
  }
}

/* -------------------------------------------------------------------------
   6. Listening to my voice (speech recognition)
   ---------------------------------------------------------------------- */

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
let recognition = null;
let listening = false;

function micLocale() {
  if (state.source === "auto") {
    return state.accents[state.lastReturn] || state.accents.en || "en-GB";
  }
  return state.accents[state.source] || LANGS[state.source].accents[0].code;
}

function startListening() {
  if (!Recognition) {
    toast("Voice input needs Chrome, Edge or Safari.");
    el.micStatus.textContent = "Voice input is not available in this browser.";
    return;
  }
  if (listening) { stopListening(); return; }

  recognition = new Recognition();
  recognition.lang = micLocale();
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  let finalText = "";

  recognition.onstart = () => {
    listening = true;
    el.micBtn.classList.add("is-listening");
    el.micBtn.querySelector(".mic-text").textContent = "Listening…";
    el.micStatus.textContent = "Listening in " + accentLabel(recognition.lang) + " — speak now.";
  };

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const chunk = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += chunk;
      else interim += chunk;
    }
    el.sourceText.value = (finalText + interim).trim();
    applyDirection();
  };

  recognition.onerror = (event) => {
    const messages = {
      "not-allowed": "Microphone blocked. Allow it in the browser, and use an https:// address.",
      "service-not-allowed": "Microphone blocked by the browser settings.",
      "no-speech": "I did not hear anything — try again.",
      "audio-capture": "No microphone found.",
      network: "The speech service could not be reached."
    };
    el.micStatus.textContent = messages[event.error] || ("Voice error: " + event.error);
  };

  recognition.onend = () => {
    listening = false;
    el.micBtn.classList.remove("is-listening");
    el.micBtn.querySelector(".mic-text").textContent = "Speak";
    const text = el.sourceText.value.trim();
    if (text) {
      el.micStatus.textContent = "Heard: “" + text + "”";
      doTranslate();
    }
  };

  try {
    recognition.start();
  } catch (err) {
    el.micStatus.textContent = "Could not start the microphone: " + err.message;
  }
}

function stopListening() {
  if (recognition && listening) recognition.stop();
}

function accentLabel(code) {
  const lang = LANGS[baseOf(code)] || LANGS[code];
  if (!lang) return code;
  const found = lang.accents.find((a) => a.code === code);
  return found ? found.label.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "").trim() : code;
}

/* -------------------------------------------------------------------------
   7. Building the interface
   ---------------------------------------------------------------------- */

function buildChips(container, order, side) {
  container.innerHTML = "";
  order.forEach((code) => {
    const lang = LANGS[code];
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.setAttribute("role", "radio");
    chip.dataset.lang = code;
    chip.style.setProperty("--c1", lang.c1);
    chip.textContent = lang.flag + " " + (code === "auto" ? "Detect" : lang.native);
    chip.addEventListener("click", () => {
      if (side === "source") setSource(code);
      else setTarget(code);
    });
    container.appendChild(chip);
  });
}

function markChips(container, active) {
  Array.from(container.children).forEach((chip) => {
    chip.setAttribute("aria-checked", String(chip.dataset.lang === active));
  });
}

function buildAccentSelect(select, langCode, selected) {
  select.innerHTML = "";

  const addOption = (accent, parent) => {
    const option = document.createElement("option");
    option.value = accent.code;
    option.textContent = accent.label;
    if (accent.code === selected) option.selected = true;
    parent.appendChild(option);
  };

  if (langCode === "auto") {
    ["en", "ar", "zh", "fr"].forEach((code) => {
      const group = document.createElement("optgroup");
      group.label = LANGS[code].flag + " " + LANGS[code].native;
      LANGS[code].accents.forEach((accent) => addOption(accent, group));
      select.appendChild(group);
    });
  } else {
    LANGS[langCode].accents.forEach((accent) => addOption(accent, select));
  }
}

function setSource(code) {
  if (code === state.target) {
    // Tapping the language already on the other side swaps instead.
    swapLanguages();
    return;
  }
  state.source = code;
  if (code !== "auto") state.lastReturn = code;
  syncLanguageUI();
  persist();
}

function setTarget(code) {
  if (code === state.source) {
    swapLanguages();
    return;
  }
  state.target = code;
  syncLanguageUI();
  persist();
}

function swapLanguages() {
  const previousSource = state.source;
  state.source = state.target;
  state.target = previousSource === "auto" ? state.lastReturn : previousSource;
  if (state.source !== "auto") state.lastReturn = state.source;

  // Swap the texts too, so a conversation can carry on naturally.
  const answer = state.lastResult ? state.lastResult.text : "";
  if (answer) {
    el.sourceText.value = answer;
    showPlaceholder();
  }
  syncLanguageUI();
  persist();
}

function syncLanguageUI() {
  markChips(el.sourceChips, state.source);
  markChips(el.targetChips, state.target);

  const micDefault = state.source === "auto"
    ? (state.accents[state.lastReturn] || "en-GB")
    : state.accents[state.source];
  buildAccentSelect(el.sourceAccent, state.source, micDefault);
  buildAccentSelect(el.targetAccent, state.target, state.accents[state.target]);

  el.sourceTitle.textContent = state.source === "auto"
    ? "✨ Detect the language"
    : LANGS[state.source].flag + " " + LANGS[state.source].native;
  el.targetTitle.textContent = LANGS[state.target].flag + " " + LANGS[state.target].native;

  applyDirection();
  renderPhrases();
}

function showPlaceholder() {
  el.targetText.textContent = "Your translation will appear here.";
  el.targetText.setAttribute("dir", "ltr");
  el.targetText.classList.remove("is-loading");
  el.targetText.classList.add("is-empty");
  el.meta.textContent = "";
  state.lastResult = null;
}

function applyDirection() {
  const sourceLang = state.source === "auto"
    ? detectLang(el.sourceText.value)
    : state.source;
  el.sourceText.setAttribute("dir", LANGS[sourceLang] ? LANGS[sourceLang].dir : "ltr");
  el.targetText.setAttribute("dir", LANGS[state.target].dir);
}

/* -------------------------------------------------------------------------
   8. Translating
   ---------------------------------------------------------------------- */

async function doTranslate() {
  const text = el.sourceText.value.trim();
  if (!text) { toast("Write or say something first."); return; }

  let from = state.source;
  let to = state.target;

  // In Detect mode, text already in the target language goes the other way,
  // which makes a two-person conversation work with one button.
  if (from === "auto") {
    const guess = detectLang(text);
    if (guess === to) {
      to = state.lastReturn === to ? "en" : state.lastReturn;
    }
  }

  el.translateBtn.disabled = true;
  el.targetText.classList.remove("is-empty");
  el.targetText.classList.add("is-loading");
  el.targetText.textContent = "Translating…";
  el.meta.textContent = "";

  try {
    const result = await translate(text, from, to);
    el.targetText.classList.remove("is-loading");
    el.targetText.textContent = result.text;
    el.targetText.setAttribute("dir", LANGS[to] ? LANGS[to].dir : "ltr");

    state.lastResult = {
      source: text,
      text: result.text,
      from: result.detected || from,
      to: to,
      at: Date.now()
    };

    const fromName = LANGS[result.detected] ? LANGS[result.detected].native : (result.detected || "?");
    const toName = LANGS[to].native;
    el.meta.textContent = fromName + " → " + toName + " · " + result.provider;
    el.saveBtn.textContent = isSaved(state.lastResult) ? "⭐" : "☆";

    addToHistory(state.lastResult);
    autoSpeakTarget(to);
  } catch (err) {
    el.targetText.classList.remove("is-loading");
    el.targetText.textContent = "Translation failed. Check the connection and try again.";
    el.meta.textContent = err.message;
  } finally {
    el.translateBtn.disabled = false;
  }
}

let autoSpeak = true;

function autoSpeakTarget(to) {
  if (!autoSpeak || !state.lastResult) return;
  const locale = to === state.target ? state.accents[state.target] : (state.accents[to] || to);
  speak(state.lastResult.text, locale, el.listenTargetBtn);
}

/* -------------------------------------------------------------------------
   9. History, favourites and the phrasebook
   ---------------------------------------------------------------------- */

function addToHistory(entry) {
  state.history = state.history.filter((item) => item.source !== entry.source || item.to !== entry.to);
  state.history.unshift(entry);
  state.history = state.history.slice(0, 40);
  persist();
  renderEntries(el.historyList, state.history, "history");
}

function isSaved(entry) {
  return state.saved.some((item) => item.source === entry.source && item.to === entry.to);
}

function toggleSave() {
  if (!state.lastResult) { toast("Translate something first."); return; }
  if (isSaved(state.lastResult)) {
    state.saved = state.saved.filter(
      (item) => !(item.source === state.lastResult.source && item.to === state.lastResult.to)
    );
    el.saveBtn.textContent = "☆";
    toast("Removed from favourites");
  } else {
    state.saved.unshift(state.lastResult);
    el.saveBtn.textContent = "⭐";
    toast("Saved to favourites");
  }
  persist();
  renderEntries(el.savedList, state.saved, "saved");
}

function renderEntries(container, list, kind) {
  container.innerHTML = "";
  if (!list.length) {
    const note = document.createElement("p");
    note.className = "empty-note";
    note.textContent = kind === "saved"
      ? "No favourites yet — press ☆ on a translation to keep it here."
      : "Nothing yet. Your last translations will show up here.";
    container.appendChild(note);
    return;
  }

  list.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "entry";

    const src = document.createElement("div");
    src.className = "e-src";
    src.textContent = entry.source;
    src.setAttribute("dir", LANGS[entry.from] ? LANGS[entry.from].dir : "auto");

    const dst = document.createElement("div");
    dst.className = "e-dst";
    dst.textContent = entry.text;
    dst.setAttribute("dir", LANGS[entry.to] ? LANGS[entry.to].dir : "auto");

    const actions = document.createElement("div");
    actions.className = "entry-actions";

    const listen = document.createElement("button");
    listen.type = "button";
    listen.textContent = "🔊 Listen";
    listen.addEventListener("click", () =>
      speak(entry.text, state.accents[entry.to] || entry.to, listen));

    const reuse = document.createElement("button");
    reuse.type = "button";
    reuse.textContent = "↩︎ Reuse";
    reuse.addEventListener("click", () => {
      el.sourceText.value = entry.source;
      applyDirection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = kind === "saved" ? "🗑 Remove" : "🗑";
    remove.addEventListener("click", () => {
      if (kind === "saved") state.saved.splice(index, 1);
      else state.history.splice(index, 1);
      persist();
      renderEntries(container, kind === "saved" ? state.saved : state.history, kind);
    });

    actions.append(listen, reuse, remove);
    card.append(src, dst, actions);
    container.appendChild(card);
  });
}

function renderPhraseCategories() {
  el.phraseCats.innerHTML = "";
  PHRASEBOOK.forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.setAttribute("role", "radio");
    chip.textContent = cat.label;
    chip.setAttribute("aria-checked", String(cat.id === state.category));
    chip.addEventListener("click", () => {
      state.category = cat.id;
      persist();
      renderPhraseCategories();
      renderPhrases();
    });
    el.phraseCats.appendChild(chip);
  });
}

function renderPhrases() {
  if (!el.phraseList) return;
  const cat = PHRASEBOOK.find((c) => c.id === state.category) || PHRASEBOOK[0];
  const to = state.target;
  let from = state.source === "auto" ? state.lastReturn : state.source;
  if (from === to) from = to === "en" ? "fr" : "en";

  el.phraseList.innerHTML = "";
  cat.items.forEach((item) => {
    const source = item[from] || item.en;
    const answer = item[to] || item.fr;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "phrase";

    const top = document.createElement("span");
    top.className = "p-src";
    top.textContent = source;
    top.setAttribute("dir", LANGS[from] ? LANGS[from].dir : "auto");

    const bottom = document.createElement("span");
    bottom.className = "p-dst";
    bottom.textContent = answer;
    bottom.setAttribute("dir", LANGS[to] ? LANGS[to].dir : "auto");

    button.append(top, bottom);
    button.addEventListener("click", () => {
      el.sourceText.value = source;
      applyDirection();
      el.targetText.classList.remove("is-empty", "is-loading");
      el.targetText.textContent = answer;
      el.targetText.setAttribute("dir", LANGS[to] ? LANGS[to].dir : "auto");
      el.meta.textContent = (LANGS[from] ? LANGS[from].native : from) + " → " +
        LANGS[to].native + " · Phrasebook";
      state.lastResult = { source: source, text: answer, from: from, to: to, at: Date.now() };
      speak(answer, state.accents[to] || to, el.listenTargetBtn);
    });

    el.phraseList.appendChild(button);
  });
}

/* -------------------------------------------------------------------------
   10. Theme
   ---------------------------------------------------------------------- */

function applyTheme() {
  const root = document.documentElement;
  if (state.theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", state.theme);
  el.themeBtn.textContent = state.theme === "dark" ? "☀️" : "🌙";
}

function cycleTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (state.theme === "auto") state.theme = prefersDark ? "light" : "dark";
  else if (state.theme === "dark") state.theme = "light";
  else state.theme = "dark";
  applyTheme();
  persist();
}

/* -------------------------------------------------------------------------
   11. Wiring everything up
   ---------------------------------------------------------------------- */

function bindEvents() {
  el.translateBtn.addEventListener("click", doTranslate);
  el.micBtn.addEventListener("click", startListening);
  el.swapBtn.addEventListener("click", swapLanguages);

  el.clearBtn.addEventListener("click", () => {
    el.sourceText.value = "";
    el.micStatus.textContent = "";
    showPlaceholder();
    el.sourceText.focus();
  });

  el.listenSourceBtn.addEventListener("click", () => {
    const lang = state.source === "auto" ? detectLang(el.sourceText.value) : state.source;
    speak(el.sourceText.value, state.accents[lang] || lang, el.listenSourceBtn);
  });

  el.listenTargetBtn.addEventListener("click", () => {
    const text = state.lastResult ? state.lastResult.text : el.targetText.textContent;
    const to = state.lastResult ? state.lastResult.to : state.target;
    speak(text, state.accents[to] || to, el.listenTargetBtn);
  });

  el.copyBtn.addEventListener("click", async () => {
    if (!state.lastResult) { toast("Nothing to copy yet."); return; }
    try {
      await navigator.clipboard.writeText(state.lastResult.text);
      toast("Copied");
    } catch (err) {
      toast("Copy failed — select the text by hand.");
    }
  });

  el.saveBtn.addEventListener("click", toggleSave);
  el.themeBtn.addEventListener("click", cycleTheme);

  el.sourceAccent.addEventListener("change", (event) => {
    const code = event.target.value;
    state.accents[langKeyFor(code)] = code;
    persist();
    el.micStatus.textContent = "Microphone set to " + accentLabel(code) + ".";
  });

  el.targetAccent.addEventListener("change", (event) => {
    const code = event.target.value;
    state.accents[langKeyFor(code)] = code;
    persist();
    if (state.lastResult) speak(state.lastResult.text, code, el.listenTargetBtn);
  });

  el.sourceText.addEventListener("input", applyDirection);

  el.sourceText.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      doTranslate();
    }
  });

  el.clearHistoryBtn.addEventListener("click", () => {
    state.history = [];
    persist();
    renderEntries(el.historyList, state.history, "history");
    toast("History cleared");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((other) => {
        const on = other === tab;
        other.classList.toggle("is-active", on);
        other.setAttribute("aria-selected", String(on));
      });
      document.querySelectorAll(".tab-body").forEach((body) => {
        body.hidden = body.id !== "tab-" + tab.dataset.tab;
      });
    });
  });
}

function init() {
  loadState();
  applyTheme();
  buildChips(el.sourceChips, SOURCE_ORDER, "source");
  buildChips(el.targetChips, TARGET_ORDER, "target");
  syncLanguageUI();
  renderPhraseCategories();
  renderPhrases();
  renderEntries(el.historyList, state.history, "history");
  renderEntries(el.savedList, state.saved, "saved");
  bindEvents();

  showPlaceholder();

  if (!Recognition) {
    el.micStatus.textContent = "Tip: open this page in Chrome, Edge or Safari to speak with your voice.";
  }
}

document.addEventListener("DOMContentLoaded", init);
