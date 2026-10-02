# Akansha & Nitish — Wedding Invitation

A digital shaadi card built with Next.js. A sealed gatefold sits on a night
table under a marigold toran while petals fall; a tap swings it open and the
booklet inside turns page by page in 3D. Every page carries a generated
Madhubani (Mithila) motif — sun, peacock, paisley, the fish-and-lotus kohbar,
kalash — the folk art of Bihar. No forms: guests only read, tap and swipe.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export in ./out — host it anywhere
```

## Change the details

Everything — names, parents, dates, muhurat, venue, events, dress codes,
travel notes, hashtag — lives in one file:

```
src/data/wedding.ts
```

Values marked `(placeholder)` are stand-ins waiting for the real ones.

## Where things live

| Path | What |
|---|---|
| `src/components/Invitation.tsx` | The card: cover, page-turn engine, navigation, input |
| `src/components/pages.tsx` | Page contents in reading order |
| `src/components/motifs.tsx` | Madhubani illustrations (generated SVG) |
| `src/components/Petals.tsx` | Three.js petal and sparkle field |
| `src/components/Toran.tsx` | The marigold and mango-leaf garland |
| `src/components/Music.tsx` | Background song from `public/audio/`, tanpura fallback if it fails to load |
| `src/app/globals.css` | Palette, type and layout tokens |

## Controls

Tap the seal to open. Then: tap the right or left edge of the card, swipe,
scroll, or use the arrow keys. "O Meri Laila" starts on that tap, fades in and loops; the top-right button mutes it. The track lives at `public/audio/o-meri-laila.mp3`.
