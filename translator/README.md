# Hamed Translator

**Done by Mhmd Rmaity.**

A simple, professional everyday translator:
**English · العربية · 中文 · Français** — typed or spoken, in both directions.

It is a plain static website (HTML, CSS, JavaScript). No account, no API key,
no build step, and it is independent from the Cedar Next.js application in this
repository.

---

## How to use it — three steps

1. **Choose the languages.** Pick what you speak and what you want to hear.
   `Detect` works out the language by itself.
2. **Speak or type.** Press **Speak** and talk, or write in the box.
3. **Read and listen.** The translation appears and is read out loud in the
   accent you chose. Copy it with ⧉ or keep it with ☆.

## Accents

| Language | Accents you can choose |
| -------- | ---------------------- |
| العربية  | Lebanese, Syrian, Egyptian, Gulf, Emirati, Moroccan, Modern standard |
| English  | British, American, Australian, Canadian, Indian |
| 中文     | Mandarin, Taiwan, Hong Kong, Cantonese |
| Français | France, Côte d'Ivoire, Sénégal, Maroc, Canada / Québec, Belgique, Suisse |

The left menu sets the accent the **microphone listens for**; the right menu
sets the accent the **answer is read in**. The page uses the closest voice
installed on your device, so adding French or Arabic voices in your phone or
computer settings gives the best result.

## The rest of the features

- **Detect mode** — if you speak French while French is the target, the answer
  comes back in the other language, so two people can talk with one button.
- **Phrasebook** — about 60 everyday sentences (greetings, shopping, restaurant,
  taxi, health, work) already written in the four languages. One tap, instant,
  and it works with no internet.
- **Recent** and **Saved** lists, kept on your device only.
- Arabic is laid out right-to-left automatically.
- Light and dark theme, built for the phone first.

## Opening the website

The microphone only works on an `https://` address or on `localhost` — that is
a browser rule, not a limit of this page. Typing and listening work anywhere.

**On this computer:**

```bash
cd translator
python3 -m http.server 4173
# then open http://localhost:4173
```

**On your phone:** upload the folder to any static host (GitHub Pages, Netlify,
Vercel, or your own web space), open the https address, then use *Add to home
screen* so it opens like an application.

Best browsers for the voice: **Chrome**, **Edge**, **Safari**. Firefox can
translate and read out loud, but cannot listen to the microphone.

## How the translation is done

`app.js` calls three public translation services, one after the other, so a
single service being down does not stop the page:

1. Google's public `translate_a` endpoint
2. Lingva
3. MyMemory

Answers are cached for the session, and phrasebook sentences never leave the
device.

## Files

| File            | What is inside                                          |
| --------------- | ------------------------------------------------------- |
| `index.html`    | The page and its three steps                            |
| `styles.css`    | Colours, layout, light and dark theme                   |
| `phrasebook.js` | The everyday sentences in the four languages            |
| `app.js`        | Languages, accents, microphone, voice, translation      |
