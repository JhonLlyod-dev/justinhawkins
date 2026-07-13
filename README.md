# Justin Hawkins — fan reference site

A single-page, SEO-optimized site about musician Justin Hawkins (The Darkness),
split into separate files:

```
index.html      Markup + SEO meta tags + Person/FAQ schema.org JSON-LD
css/style.css   All styling, design tokens, dark/light theme, animations
js/script.js    Theme toggle, mobile nav, scroll reveal, FAQ accordion,
                and the interactive vocal-range synth widget
images/         Placeholder SVGs — swap these for real photos
```

## Replacing the placeholder images

Every image in `images/` is a labelled placeholder SVG so the layout previews
correctly. To use real photos:

1. Add your real image files anywhere in `images/` (e.g. `hero-portrait.jpg`).
2. In `index.html`, update the matching `<img src="images/....svg">` to point
   at your new file.
3. Keep the `width`/`height` attributes close to the originals (or update
   them to match your image's real aspect ratio) to avoid layout shift.

Placeholder map:

| File                        | Used for                              | Suggested aspect |
|------------------------------|----------------------------------------|-------------------|
| hero-portrait.svg           | Hero — full body / performance shot    | 4:5 |
| bio-portrait.svg            | Biography — close-up portrait          | 7:8 |
| darkness-band.svg           | The Darkness band photo                | 3:2 |
| hotleg-band.svg             | Hot Leg band photo                     | 3:2 |
| british-whale.svg           | British Whale artwork                  | 3:2 |
| youtube-thumb.svg           | Rides Again YouTube still              | 16:9 |
| gear-guitar.svg             | Signature Les Paul                     | 1:1 |
| album-*.svg (4 files)       | Album covers                           | 1:1 |
| live-stage.svg              | Final CTA banner background            | 12:7 |
| favicon.svg                 | Browser tab icon                       | 1:1 |

## Notes

- Dark mode is called "Darkness Mode" and light mode "Stage Lights Mode" —
  toggle lives in the header and persists via `localStorage`.
- The vocal-range widget synthesises tones in the browser with the Web Audio
  API — it is not a recording of Justin Hawkins' actual voice.
- All biographical content is paraphrased from public sources (Wikipedia,
  AllMusic, Guitar.com, The Creative Independent, Parade) linked in the
  "Sources and further reading" section of the page.
- This is an unofficial fan project — not affiliated with Justin Hawkins or
  The Darkness.
