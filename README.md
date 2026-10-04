# Akancha & Nitish — Wedding Invitation

A digital shaadi card built with Next.js, in the manner of a fine printed
invite: ivory paper, a hairline gold arch, watercolor lilies and blush roses,
and the names in gold script. A wax-sealed gatefold opens onto the arch, and
the invitation plays inside it card by card — the couple, the invitation,
each ceremony, the venue and a countdown to the pheras. The couple appear as
a faceless watercolor illustration. No forms: guests only read, tap and swipe.

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
| `src/components/Invitation.tsx` | Gatefold cover, scene engine, navigation, input |
| `src/components/scenes.tsx` | Card contents in playing order |
| `src/components/ornaments.tsx` | Gold line-art: event icons, calendar, pin, flourish |
| `src/components/Backdrop.tsx` | Watercolor florals framing the viewport |
| `src/components/Petals.tsx` | Three.js falling rose petals and gold dust |
| `src/components/Music.tsx` | Background song from `public/audio/`, tanpura fallback if it fails to load |
| `public/art/` | The couple illustration and floral paintings (transparent WebP) |
| `src/app/globals.css` | Palette, type and layout tokens |

## Controls

The opening page shows Shri Ganesh. Tap anywhere (or the seal) to hear
15 seconds of *Vakratunda Mahakaya* (7s–22s of the Suresh Wadkar recording)
— then "O Meri Laila" starts at 1:13. The top-right button mutes it.

## Audio

- `public/audio/vakratunda.mp3` — 7s to 22s only from
  [Suresh Wadkar / Shemaroo Bhakti](https://www.youtube.com/watch?v=LNlRfBJbpDU).
- `public/audio/o-meri-laila.mp3` — from 1:13 through the rest of the track.
